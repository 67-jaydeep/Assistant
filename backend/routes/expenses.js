const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const Activity = require("../models/Activity"); // 🆕 For activity tracking
const jwt = require("jsonwebtoken");

// 🔒 Verify user token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// 💰 Get all user expenses
router.get("/", verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Server error while fetching expenses" });
  }
});

// ➕ Add new expense or income
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, amount, type, category, accountName, date } = req.body;
    if (!title || !amount || !category || !accountName)
      return res.status(400).json({ message: "All fields are required" });

    const expense = new Expense({
      userId: req.userId,
      title,
      amount,
      type,
      category,
      accountName,
      date: date || new Date(),
    });

    await expense.save();

    // 🆕 Log user activity
    await Activity.create({
      userId: req.userId,
      type: "expense",
      action: type === "income" ? "added income" : "added expense",
      details: `${title} - ₹${amount} (${accountName})`,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error("Error creating expense:", err);
    res.status(500).json({ message: "Server error while creating expense" });
  }
});

// ✏️ Update expense
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, amount, type, category, accountName, date } = req.body;
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, amount, type, category, accountName, date },
      { new: true }
    );

    if (!updatedExpense) return res.status(404).json({ message: "Expense not found" });

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "expense",
      action: "updated",
      details: `${updatedExpense.title} - ₹${updatedExpense.amount}`,
    });

    res.json(updatedExpense);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ message: "Server error while updating expense" });
  }
});

// ❌ Delete expense
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) return res.status(404).json({ message: "Expense not found" });

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "expense",
      action: "deleted",
      details: `${deleted.title} - ₹${deleted.amount}`,
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Server error while deleting expense" });
  }
});

// 📊 Summary per account (income, expense, balance)
router.get("/summary", verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });

    const accounts = {};

    expenses.forEach((exp) => {
      if (!accounts[exp.accountName]) {
        accounts[exp.accountName] = { income: 0, expense: 0, balance: 0 };
      }
      if (exp.type === "income") {
        accounts[exp.accountName].income += exp.amount;
      } else {
        accounts[exp.accountName].expense += exp.amount;
      }
      accounts[exp.accountName].balance =
        accounts[exp.accountName].income - accounts[exp.accountName].expense;
    });

    res.json(accounts);
  } catch (err) {
    console.error("Error generating summary:", err);
    res.status(500).json({ message: "Server error while fetching summary" });
  }
});

// 🧾 Get all unique user accounts
router.get("/accounts", verifyToken, async (req, res) => {
  try {
    const accounts = await Expense.distinct("accountName", { userId: req.userId });
    res.json(accounts);
  } catch (err) {
    console.error("Error fetching accounts:", err);
    res.status(500).json({ message: "Server error while fetching accounts" });
  }
});

// ➕ Add new account permanently
router.post("/accounts", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await Expense.findOne({
      userId: req.userId,
      accountName: name,
      isAccountOnly: true,
    });

    if (existing) return res.json({ message: "Account already exists" });

    const newAccount = new Expense({
      userId: req.userId,
      accountName: name,
      isAccountOnly: true, // Special flag for pure accounts
    });

    await newAccount.save();

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "account",
      action: "added",
      details: `${name}`,
    });

    res.status(201).json(newAccount);
  } catch (err) {
    console.error("Error adding account:", err);
    res.status(500).json({ message: "Server error while adding account" });
  }
});

module.exports = router;
