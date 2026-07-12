import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// The API key lives in Backend/.env as GEMINI_API_KEY.
// Get one free at https://aistudio.google.com/app/apikey
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_1);

/**
 * POST /api/v1/ai/suggestion
 * body: { disease, prediction, age, gender }
 *
 * Takes the ML model's prediction and returns a short, plain-language
 * AI-generated explanation + lifestyle suggestions. This is explicitly
 * NOT a diagnosis - the prompt and the UI both need to make that clear.
 */
const getHealthSuggestion = asyncHandler(async (req, res) => {
  const { disease, prediction, age, gender } = req.body;

  if (!disease || !prediction) {
    throw new ApiError(400, "disease and prediction are required");
  }

  if (!process.env.GEMINI_API_KEY_1) {
    return res.status(503).json({
      success: false,
      message: "AI suggestions are not configured on the server yet.",
    });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const prompt = `You are a cautious health-information assistant inside a disease-prediction web app called MediPredict.
A machine learning model produced this result for a user:

Disease checked: ${disease}
Model result: ${prediction}
Age: ${age || "not provided"}
Gender: ${gender || "not provided"}

Write a short, supportive response with:
1. One plain-language sentence explaining what this result means.
2. 3-4 practical, general next-step or lifestyle suggestions relevant to this result (e.g. diet, activity, monitoring, when to see a doctor). Keep them general and safe, not prescriptive dosages or treatments.
3. One clear closing sentence reminding the user this is not a medical diagnosis and a licensed doctor should be consulted for confirmation.

Keep the whole response under 130 words, plain text, no markdown headers or bullet symbols - just short sentences.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return res.status(200).json({
      success: true,
      suggestion: text,
    });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    return res.status(502).json({
      success: false,
      message: "Could not generate an AI suggestion right now.",
    });
  }
});

const SYSTEM_INSTRUCTION = `You are "MediPredict Assistant", a friendly, cautious health-information assistant built into the MediPredict AI disease prediction platform.

What you can do:
- Answer general health and wellness questions in plain language.
- Explain what MediPredict's disease predictors do (currently: Lung Cancer is live; Heart Disease, Diabetes, and Breast Cancer are coming soon).
- Point users to the Predictors page when they describe symptoms or ask for a risk check, since you cannot run predictions yourself in this chat.

What you must never do:
- Never diagnose a specific condition or tell a user they definitely do/don't have a disease.
- Never give specific drug names, dosages, or treatment plans.
- Never claim certainty about a medical outcome.

Style:
- Keep answers short and conversational, like a helpful chat message, not an essay.
- If a question is clearly medical/diagnostic in nature, gently remind the user to consult a licensed doctor, but still be genuinely helpful with general information.
- No markdown headers or bullet symbols - plain conversational text only.`;

/**
 * POST /api/v1/ai/chat
 * body: { messages: [{ role: "user" | "assistant", content: string }] }
 *
 * Powers the chat widget in the navbar. The frontend keeps the full
 * conversation in state and sends it every time (stateless backend,
 * no session storage needed).
 */
const chatWithAI = asyncHandler(async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new ApiError(400, "messages array is required");
  }

  if (!process.env.GEMINI_API_KEY_1) {
    return res.status(503).json({
      success: false,
      message: "AI chat is not configured on the server yet.",
    });
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  // Everything except the last message becomes chat history;
  // the last message is what we actually send now.
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1].content;

  try {
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text().trim();

    return res.status(200).json({
      success: true,
      reply: text,
    });
  } catch (error) {
    console.error("Gemini chat error:", error.message);
    return res.status(502).json({
      success: false,
      message: "Could not get a response right now. Please try again.",
    });
  }
});

export { chatWithAI, getHealthSuggestion };
