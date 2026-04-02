// controllers/scoreController.js
import Score from "../models/Score.js";

// ADD SCORE (WITH 5-SCORE LIMIT)
export const addScore = async (req, res) => {
  try {
    const { value, date } = req.body;

    // Get existing scores (oldest first)
    const existingScores = await Score.find({ user: req.user._id })
      .sort({ date: 1 });

    // If already 5 scores → delete oldest
    if (existingScores.length >= 5) {
      await Score.findByIdAndDelete(existingScores[0]._id);
    }

    // Create new score
    const newScore = await Score.create({
      user: req.user._id,
      value,
      date
    });

    res.status(201).json(newScore);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add score" });
  }
};

export const getMyScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id })
      .sort({ date: -1 }); // newest first

    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scores" });
  }
};