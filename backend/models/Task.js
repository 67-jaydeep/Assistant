  const mongoose = require("mongoose");

  const TaskSchema = new mongoose.Schema(
    {
      userId: { type: String, required: true }, // matches JWT userId
      title: { type: String, required: true },
      description: { type: String, required: true },
      priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
      dueDate: { type: Date },
      pinned: { type: Boolean, default: false },
      completed: { type: Boolean, default: false },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Task", TaskSchema);
