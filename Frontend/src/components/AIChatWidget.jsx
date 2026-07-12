import { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaRobot, FaTimes } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AIChatWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the MediPredict Assistant. Ask me anything about your health, or how to use the disease predictors on this site.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // ===== FIX : Gemini requires the first message in history to
      // have role "user". Our static welcome message is role
      // "assistant" and always sits first in the UI array, which
      // breaks that rule. Drop everything before the first user
      // message when building the payload we actually send. =====
      const firstUserIndex = newMessages.findIndex(
        (m) => m.role === "user"
      );
      const conversationToSend =
        firstUserIndex === -1
          ? newMessages
          : newMessages.slice(firstUserIndex);

      const res = await fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ messages: conversationToSend }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I couldn't respond right now. Please try again in a moment.",
          },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong connecting to the server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-overlay" onClick={onClose}>
      <div className="ai-chat-panel" onClick={(e) => e.stopPropagation()}>

        <div className="ai-chat-header">
          <div className="ai-chat-header-title">
            <FaRobot className="ai-chat-header-icon" />
            <span>MediPredict Assistant</span>
          </div>
          <button
            className="ai-chat-close"
            onClick={onClose}
            aria-label="Close chat"
          >
            <FaTimes />
          </button>
        </div>

        <div className="ai-chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`ai-chat-bubble-row ${
                msg.role === "user" ? "ai-chat-row-user" : "ai-chat-row-bot"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="ai-chat-avatar">
                  <FaRobot />
                </div>
              )}
              <div
                className={`ai-chat-bubble ${
                  msg.role === "user"
                    ? "ai-chat-bubble-user"
                    : "ai-chat-bubble-bot"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="ai-chat-bubble-row ai-chat-row-bot">
              <div className="ai-chat-avatar">
                <FaRobot />
              </div>
              <div className="ai-chat-bubble ai-chat-bubble-bot ai-chat-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-input-row">
          <textarea
            className="ai-chat-input"
            placeholder="Ask about your health..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="ai-chat-send"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <FaPaperPlane />
          </button>
        </div>

        <p className="ai-chat-disclaimer">
          Not a substitute for professional medical advice.
        </p>

      </div>
    </div>
  );
}

export default AIChatWidget;
