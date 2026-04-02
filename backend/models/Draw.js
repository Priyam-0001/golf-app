import mongoose from "mongoose";

const drawSchema = new mongoose.Schema({
  numbers: [Number], // 5 numbers

  type: {
    type: String,
    enum: ["random", "frequency"],
  },

  month: Number,
  year: Number,

  isPublished: {
    type: Boolean,
    default: false,
  },

  // NEW FIELDS
  totalPool: {
    type: Number,
    default: 0,
  },

  prizeBreakdown: {
    five: { type: Number, default: 0 },
    four: { type: Number, default: 0 },
    three: { type: Number, default: 0 },
  },

  // Jackpot carry forward
  jackpotCarry: {
    type: Number,
    default: 0,
  },

}, { timestamps: true });

export default mongoose.model("Draw", drawSchema);