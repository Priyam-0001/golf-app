import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "./models/User.js";
import Score from "./models/Score.js";
import Draw from "./models/Draw.js";
import Winner from "./models/Winner.js";
import Charity from "./models/Charity.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("DB Connected");

await User.deleteMany();
await Score.deleteMany();
await Draw.deleteMany();
await Winner.deleteMany();
await Charity.deleteMany();

console.log("Old data cleared");

const password = await bcrypt.hash("123456", 10);

const admin = await User.create({
  email: "admin@test.com",
  password,
  role: "admin",
  subscriptionActive: true
});

const user1 = await User.create({
  email: "user@test.com",
  password,
  role: "user",
  subscriptionActive: true
});

const user2 = await User.create({
  email: "free@test.com",
  password,
  role: "user",
  subscriptionActive: false
});

console.log("Users created");

const scoresData = [
  { user: user1._id, value: 12 },
  { user: user1._id, value: 18 },
  { user: user1._id, value: 25 },
  { user: user1._id, value: 30 },
  { user: user1._id, value: 40 },
];

await Score.insertMany(
  scoresData.map(s => ({
    ...s,
    date: new Date()
  }))
);

console.log("Scores added");

const draw = await Draw.create({
  numbers: [12, 18, 30, 33, 40],
  type: "random",
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  isPublished: true
});

console.log("Draw created");

await Winner.create({
  user: user1._id,
  draw: draw._id,
  matchCount: 4,
  prize: 7000,
  status: "pending"
});

console.log("Winner added");

// Create charities
const charities = await Charity.insertMany([
  {
    name: "Save the Children",
    description: "Helping children worldwide"
  },
  {
    name: "Clean Water Initiative",
    description: "Providing clean drinking water"
  },
  {
    name: "Green Earth",
    description: "Environmental protection"
  }
]);

console.log("Charities added");

// Assign charity to user
user1.charity = charities[0]._id;
user1.charityPercentage = 15;
await user1.save();

console.log("\n✅ SEED COMPLETE\n");

process.exit();