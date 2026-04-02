import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import {
    getAllUsers,
    subscribe,
    toggleSubscription
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Admin: get all users
router.get("/", protect, adminOnly, getAllUsers);

// Admin: activate/deactivate subscription
router.put("/subscription/:id", protect, adminOnly, toggleSubscription);

// Get current user
router.get("/me", protect, async (req, res) => {
    res.json(req.user);
});

router.post("/subscribe", protect, subscribe)

export default router;