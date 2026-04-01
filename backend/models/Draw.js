// models/Draw.js
import mongoose from "mongoose";

const drawSchema = new mongoose.Schema({
    numbers: [Number], // 5 numbers
    type: { type: String, enum: ["random", "frequency"] },
    month: Number,
    year: Number,
    isPublished: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Draw", drawSchema);