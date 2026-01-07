const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const Activity = require("../models/Activity");
const jwt = require("jsonwebtoken");

// 🔐 AUTH
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// 🕒 GRACE TIME (3 AM)
function getToday() {
  const d = new Date();
  d.setHours(d.getHours() - 3);
  return d;
}

// 📅 PERIOD CHECK
function samePeriod(d1, d2, frequency) {
  if (!d1 || !d2) return false;
  const a = new Date(d1);
  const b = new Date(d2);

  if (frequency === "Daily")
    return a.toDateString() === b.toDateString();

  if (frequency === "Weekly") {
    const week = (d) =>
      Math.floor(
        (d - new Date(d.getFullYear(), 0, 1)) / (7 * 86400000)
      );
    return a.getFullYear() === b.getFullYear() && week(a) === week(b);
  }

  if (frequency === "Monthly")
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth()
    );

  return false;
}

// ==========================
// GET HABITS (RESET + STREAK)
// ==========================
router.get("/", verifyToken, async (req, res) => {
  const habits = await Habit.find({ userId: req.userId });
  const today = getToday();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  for (const habit of habits) {
    const last = habit.lastCompletedAt
      ? new Date(habit.lastCompletedAt)
      : null;

    // Daily reset
    if (!samePeriod(last, today, habit.frequency)) {
      habit.completed = false;
      habit.progress = 0;
    }

    // Missed-day streak break
    if (
      habit.streak > 0 &&
      last &&
      !samePeriod(last, yesterday, habit.frequency)
    ) {
      habit.streak = 0;
    }

    await habit.save();
  }

  res.json(habits);
});

// ==========================
// CREATE HABIT
// ==========================
router.post("/", verifyToken, async (req, res) => {
  const { title, description, frequency, habitType, dailyTarget } = req.body;

  if (habitType === "counter" && (!dailyTarget || dailyTarget < 1)) {
    return res.status(400).json({ message: "Invalid daily target" });
  }

  const habit = new Habit({
    userId: req.userId,
    title,
    description,
    frequency,
    habitType,
    dailyTarget: habitType === "counter" ? dailyTarget : 1,
  });

  await habit.save();
  res.json(habit);
});

// ==========================
// COMPLETE / PROGRESS
// ==========================
router.patch("/:id/complete", verifyToken, async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!habit) return res.status(404).json({ message: "Not found" });

  const today = getToday();

  // Block double completion
  if (samePeriod(habit.lastCompletedAt, today, habit.frequency)) {
    return res.json(habit);
  }

  if (habit.habitType === "counter") {
    habit.progress += 1;

    if (habit.progress >= habit.dailyTarget) {
      habit.progress = habit.dailyTarget;
      habit.completed = true;
      habit.streak += 1;
      habit.lastCompletedAt = today;
    }
  } else {
    habit.completed = true;
    habit.streak += 1;
    habit.lastCompletedAt = today;
  }

  await habit.save();
  res.json(habit);
});

// ==========================
// UNDO PROGRESS
// ==========================
router.patch("/:id/undo", verifyToken, async (req, res) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!habit || habit.habitType !== "counter") {
    return res.status(400).json({ message: "Invalid undo" });
  }

  habit.progress = Math.max(habit.progress - 1, 0);
  habit.completed = false;

  await habit.save();
  res.json(habit);
});

module.exports = router;
