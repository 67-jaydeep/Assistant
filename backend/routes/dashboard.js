const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Expense = require("../models/Expense");
const Note = require("../models/Note");
const Habit = require("../models/Habit");
const jwt = require("jsonwebtoken");

// Middleware inside route
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

// Dashboard summary route
router.get("/", verifyToken, async (req, res) => {
  try {
    // Tasks
    const tasks = await Task.find({ userId: req.userId });
    const tasksSummary = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
    };

    // Expenses
    const expenses = await Expense.find({ userId: req.userId });
    const totalIncome = expenses.filter(e => e.type === "income").reduce((a,b)=> a+b.amount, 0);
    const totalExpense = expenses.filter(e => e.type === "expense").reduce((a,b)=> a+b.amount,0);
    const expensesSummary = {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    };

    // Notes
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    const pinnedNotes = notes.filter(n => n.pinned).length;
    const notesSummary = {
      total: notes.length,
      pinned: pinnedNotes,
      lastUpdated: notes.length ? notes[0].createdAt : null,
    };

    // Habits
    const habits = await Habit.find({ userId: req.userId });
    const completedToday = habits.filter(h => h.completed).length;
    const habitsSummary = {
      total: habits.length,
      completedToday,
      streak: 0, // optional streak logic
    };

    res.json({ tasks: tasksSummary, expenses: expensesSummary, notes: notesSummary, habits: habitsSummary });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
