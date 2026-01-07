const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },

    frequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      default: "Daily",
    },

    pinned: { type: Boolean, default: false },

    habitType: {
      type: String,
      enum: ["binary", "counter"],
      default: "binary",
    },

    dailyTarget: { type: Number, default: 1 },
    progress: { type: Number, default: 0 },

    completed: { type: Boolean, default: false },

    streak: { type: Number, default: 0 },
    lastCompletedAt: { type: Date, default: null },

    // 🔮 FUTURE (dashboard only)
    reminderEnabled: { type: Boolean, default: false },
    reminderTime: { type: String, default: null }, // "07:30"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);
