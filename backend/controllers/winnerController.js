import Winner from "../models/Winner.js";

export const getMyWinnings = async (req, res) => {
    const winnings = await Winner.find({ user: req.user._id })
        .populate("draw");

    res.json(winnings);
};

export const getAllWinners = async (req, res) => {
    const winners = await Winner.find()
    .populate("user", "email")
    .populate("draw");

    res.json(winners);
};