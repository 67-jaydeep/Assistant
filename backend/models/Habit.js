const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    frequency: { type: String, default: "Daily" },
    pinned: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);
