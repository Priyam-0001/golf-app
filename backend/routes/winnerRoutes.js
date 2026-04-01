import express from "express";
import {
  getMyWinnings,
  getAllWinners
} from "../controllers/winnerController.js";

import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// User winnings
router.get("/me", protect, getMyWinnings);

// Admin: all winners
router.get("/", protect, adminOnly, getAllWinners);

export default router;