const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Activity = require("../models/Activity"); // 🆕 Activity model added
const jwt = require("jsonwebtoken");

// ✅ Token verification middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ✅ Get all tasks
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create task
router.post("/", verifyToken, async (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  try {
    const task = new Task({
      userId: req.userId,
      title,
      description,
      priority,
      dueDate,
    });
    await task.save();

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "task",
      action: "created",
      details: `${title} (${priority})`,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update task
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "task",
      action: "updated",
      details: `${updatedTask.title}`,
    });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete task
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "task",
      action: "deleted",
      details: `${deletedTask.title}`,
    });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Toggle pin
router.patch("/:id/pin", verifyToken, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.pinned = !task.pinned;
    await task.save();

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "task",
      action: task.pinned ? "pinned" : "unpinned",
      details: `${task.title}`,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Toggle complete
router.patch("/:id/complete", verifyToken, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    await task.save();

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "task",
      action: task.completed ? "completed" : "marked incomplete",
      details: `${task.title}`,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
