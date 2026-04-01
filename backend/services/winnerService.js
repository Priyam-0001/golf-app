// services/winnerService.js
import Score from "../models/Score.js";
import Winner from "../models/Winner.js";

export async function calculateWinners(draw) {
    const users = await Score.distinct("user");

    for (let userId of users) {
        const scores = await Score.find({ user: userId });

        const userScores = scores.map(s => s.value);

        const matches = userScores.filter(s =>
            draw.numbers.includes(s)
        ).length;

        if (matches >= 3) {
            await Winner.create({
            user: userId,
            draw: draw._id,
            matchCount: matches,
            prize: 0 // calculate later
            });
        }
    }
}

export function distributePrizes(totalPool, winners) {
    const tiers = {
        5: 0.4,
        4: 0.35,
        3: 0.25
    };

    const grouped = {
        5: [],
        4: [],
        3: []
    };

    winners.forEach(w => {
        grouped[w.matchCount].push(w);
    });

    for (let tier in grouped) {
        const group = grouped[tier];

        if (group.length === 0) continue;

        const total = totalPool * tiers[tier];
        const perUser = total / group.length;

        group.forEach(w => {
            w.prize = perUser;
            w.save();
        });
    }
}