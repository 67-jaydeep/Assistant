const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const jwt = require("jsonwebtoken");
const Activity = require("../models/Activity"); // 🆕 Activity model added

// ✅ Token verification middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ✅ Get all habits
router.get("/", verifyToken, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create habit
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, frequency } = req.body;
    const habit = new Habit({ userId: req.userId, title, description, frequency });
    await habit.save();

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "habit",
      action: "created",
      details: `${title}`,
    });

    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update habit
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, description, frequency } = req.body;
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description, frequency },
      { new: true }
    );

    if (!habit) return res.status(404).json({ message: "Habit not found" });

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "habit",
      action: "updated",
      details: `${habit.title}`,
    });

    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete habit
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "habit",
      action: "deleted",
      details: `${habit.title}`,
    });

    res.json({ message: "Habit deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Toggle pin
router.patch("/:id/pin", verifyToken, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    habit.pinned = !habit.pinned;
    await habit.save();

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "habit",
      action: habit.pinned ? "pinned" : "unpinned",
      details: `${habit.title}`,
    });

    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Toggle complete
router.patch("/:id/complete", verifyToken, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    habit.completed = !habit.completed;
    await habit.save();

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "habit",
      action: habit.completed ? "completed" : "uncompleted",
      details: `${habit.title}`,
    });

    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
