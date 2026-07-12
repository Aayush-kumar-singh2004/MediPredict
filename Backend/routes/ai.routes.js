import { Router } from "express";
import { getHealthSuggestion, chatWithAI } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/suggestion").post(verifyJWT, getHealthSuggestion);
router.route("/chat").post(verifyJWT, chatWithAI);

export default router;
