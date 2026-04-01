// models/Winner.js
import mongoose from "mongoose";

const winnerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    draw: { type: mongoose.Schema.Types.ObjectId, ref: "Draw" },

    matchCount: Number, // 3, 4, 5
    prize: Number,

    status: { type: String, enum: ["pending", "paid"], default: "pending" }
});

export default mongoose.model("Winner", winnerSchema);