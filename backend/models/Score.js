// models/Score.js
import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    value: { type: Number, min: 1, max: 45 },
    date: Date
}, { timestamps: true });

export default mongoose.model("Score", scoreSchema);