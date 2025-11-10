const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["task", "note", "habit", "expense"],
      required: true,
    },
    action: { type: String, required: true }, // e.g., created, updated, deleted
    details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
