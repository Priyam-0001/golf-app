import express from "express";
import Charity from "../models/Charity.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get all charities
router.get("/", async (req, res) => {
  const charities = await Charity.find();
  res.json(charities);
});

// Select charity
router.post("/select", protect, async (req, res) => {
  const { charityId, percentage } = req.body;

  req.user.charity = charityId;
  req.user.charityPercentage = percentage || 10;

  await req.user.save();

  res.json({ message: "Charity selected" });
});

export default router;