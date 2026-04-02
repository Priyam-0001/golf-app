import User from "../models/User.js";
import Winner from "../models/Winner.js";
import Draw from "../models/Draw.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const activeSubscribers = await User.countDocuments({
      subscriptionActive: true,
    });

    const totalWinners = await Winner.countDocuments();

    const latestDraw = await Draw.findOne().sort({ createdAt: -1 });

    const totalPool = latestDraw?.totalPool || 0;

    res.json({
      totalUsers,
      activeSubscribers,
      totalWinners,
      totalPool,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load stats" });
  }
};