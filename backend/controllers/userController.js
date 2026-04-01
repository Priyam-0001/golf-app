import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
};

export const toggleSubscription = async (req, res) => {
    const user = await User.findById(req.params.id);

    user.subscriptionActive = !user.subscriptionActive;

    await user.save();

    res.json(user);
};

export const subscribe = async (req, res) => {
    const user = req.user;

    user.subscriptionActive = true;
    await user.save();

    res.json({ message: "Subscription activated" });
};