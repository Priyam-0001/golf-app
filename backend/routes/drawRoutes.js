import express from "express";
import { runDraw, getLatestDraw } from "../controllers/drawController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Run draw (admin only)
router.post("/run", protect, adminOnly, runDraw);

// Get latest draw
router.get("/latest", protect, getLatestDraw);

// Public preview (no login)
router.get("/public", getLatestDraw);

export default router;