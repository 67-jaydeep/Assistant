const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
  },
  amount: {
    type: Number,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    default: "expense",
  },
  category: {
    type: String,
  },
  accountName: {
    type: String,
    default: "Cash",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // ✅ NEW FIELD (for permanent account entries)
  isAccountOnly: {
    type: Boolean,
    default: false, // true means it's just an account entry (no transaction)
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
