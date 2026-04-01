// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: String,
    password: {
        type: String,
        required: true
    },
    role: { type: String, default: "user" },

    subscriptionActive: { type: Boolean, default: false },

    charity: {
        type: mongoose.Schema.Types.ObjectId,
            ref: "Charity"
    },
    charityPercentage: {
        type: Number,
        default: 10
    },
    charityPercentage: { type: Number, default: 10 }
}, { timestamps: true });

export default mongoose.model("User", userSchema);