// controllers/drawController.js
import Draw from "../models/Draw.js";
import { randomDraw, frequencyDraw } from "../services/drawService.js";
import { calculateWinners } from "../services/winnerService.js";

export const runDraw = async (req, res) => {
    const { type } = req.body;

    let numbers;

    if (type === "frequency") {
    numbers = await frequencyDraw();
    } else {
    numbers = randomDraw();
    }

    const draw = await Draw.create({
    numbers,
    type,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
    });

    await calculateWinners(draw);

    res.json(draw);
};

export const getLatestDraw = async (req, res) => {
    const draw = await Draw.findOne().sort({ createdAt: -1 });

    res.json(draw);
};