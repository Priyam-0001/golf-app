import express from "express";
import { addScore, getMyScores } from "../controllers/scoreController.js";
import { protect, requireSubscription } from "../middleware/auth.js";

const router = express.Router();

// Add score
router.post("/", protect, requireSubscription, addScore);

// Get user scores
router.get("/", protect, getMyScores);

export default router;