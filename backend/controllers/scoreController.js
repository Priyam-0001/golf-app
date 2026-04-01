// controllers/scoreController.js
import Score from "../models/Score.js";

export const addScore = async (req, res) => {
    const { value, date } = req.body;
    const userId = req.user.id;

    // Add new score
    await Score.create({ user: userId, value, date });

    // Keep only latest 5
    const scores = await Score.find({ user: userId })
    .sort({ date: -1 });

    if (scores.length > 5) {
    const toDelete = scores.slice(5);
    await Score.deleteMany({
        _id: { $in: toDelete.map(s => s._id) }
    });
    }

    res.json({ message: "Score added" });
};

export const getMyScores = async (req, res) => {
    const scores = await Score.find({ user: req.user._id })
        .sort({ date: -1 });

    res.json(scores);
};