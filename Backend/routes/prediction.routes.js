import { Router } from "express";
import {
  heartpred,
  lungpred,
  upload,
} from "../controllers/pred.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secured routes
router.route("/heart-pred").post(verifyJWT, heartpred);

router.route("/lung-pred").post(verifyJWT, upload.single("image"), lungpred);


export default router;
