import Score from "../models/Score.js";
import Winner from "../models/Winner.js";

export const calculateWinners = async (draw, prizeBreakdown) => {
  try {
    // 1️⃣ Get all scores
    const scores = await Score.find();

    // 2️⃣ Group scores by user
    const userMap = {};

    for (const s of scores) {
      if (!userMap[s.user]) {
        userMap[s.user] = [];
      }
      userMap[s.user].push(s.value);
    }

    // 3️⃣ Calculate matches
    const winners = [];

    for (const userId in userMap) {
      const userScores = userMap[userId];

      const matches = userScores.filter(score =>
        draw.numbers.includes(score)
      ).length;

      if (matches >= 3) {
        winners.push({
          user: userId,
          matchCount: matches,
        });
      }
    }

    // 4️⃣ Group winners
    const grouped = {
      5: [],
      4: [],
      3: []
    };

    winners.forEach(w => {
      grouped[w.matchCount].push(w);
    });

    // 5️⃣ Calculate prize per user
    const prizePer = {
      5: grouped[5].length ? prizeBreakdown.five / grouped[5].length : 0,
      4: grouped[4].length ? prizeBreakdown.four / grouped[4].length : 0,
      3: grouped[3].length ? prizeBreakdown.three / grouped[3].length : 0,
    };

    // 6️⃣ Save winners with correct prize
    const finalWinners = [];

    for (const w of winners) {
      const prize = prizePer[w.matchCount];

      const winner = await Winner.create({
        user: w.user,
        draw: draw._id,
        matchCount: w.matchCount,
        prize
      });

      finalWinners.push(winner);
    }

    return finalWinners;

  } catch (err) {
    console.error(err);
    throw err;
  }
};