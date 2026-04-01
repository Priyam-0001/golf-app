import mongoose from "mongoose";

const charitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  image: String
}, { timestamps: true });

export default mongoose.model("Charity", charitySchema);