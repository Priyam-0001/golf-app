import Draw from "../models/Draw.js";
import User from "../models/User.js";
import { randomDraw, frequencyDraw } from "../services/drawService.js";
import { calculateWinners } from "../services/winnerService.js";

export const runDraw = async (req, res) => {
  try {
    const { type, simulate } = req.body;

    let numbers;

    // Choose draw type
    if (type === "frequency") {
      numbers = await frequencyDraw();
    } else {
      numbers = randomDraw();
    }

    // STEP 1: Count active subscribers
    const activeUsers = await User.countDocuments({
      subscriptionActive: true,
    });

    const SUBSCRIPTION_FEE = 100;

    // STEP 2: Get previous draw for jackpot
    const previousDraw = await Draw.findOne().sort({ createdAt: -1 });

    let jackpotCarry = previousDraw?.jackpotCarry || 0;

    const totalPool = activeUsers * SUBSCRIPTION_FEE + jackpotCarry;

    // STEP 3: Prize distribution
    const prizeBreakdown = {
      five: totalPool * 0.4,
      four: totalPool * 0.35,
      three: totalPool * 0.25,
    };

    // STEP 4: Simulation mode (NO DB write)
    if (simulate) {
      const fakeDraw = {
        numbers,
        type,
        simulated: true,
      };

      const winners = await calculateWinners(fakeDraw, prizeBreakdown);

      return res.json({
        draw: fakeDraw,
        totalPool,
        prizeBreakdown,
        winners,
      });
    }

    // STEP 5: Create draw
    const draw = await Draw.create({
      numbers,
      type,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      totalPool,
      prizeBreakdown,
      jackpotCarry,
    });

    // STEP 6: Calculate winners
    const winners = await calculateWinners(draw, prizeBreakdown);

    // STEP 7: Jackpot rollover
    const hasJackpotWinner = winners.some(w => w.matchCount === 5);

    if (!hasJackpotWinner) {
      draw.jackpotCarry = prizeBreakdown.five;
      await draw.save();
    } else {
      draw.jackpotCarry = 0;
      await draw.save();
    }

    res.json({
      draw,
      winners,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to run draw" });
  }
};

export const getLatestDraw = async (req, res) => {
  try {
    const draw = await Draw.findOne().sort({ createdAt: -1 });
    res.json(draw);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch draw" });
  }
};