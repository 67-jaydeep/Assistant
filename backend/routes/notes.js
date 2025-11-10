const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const jwt = require("jsonwebtoken");
const Activity = require("../models/Activity"); // 🆕 Activity model added

// ✅ Middleware to verify token
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

// ✅ Get all notes (for logged-in user)
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create new note
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = new Note({
      userId: req.userId,
      title,
      content,
    });

    await note.save();

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "note",
      action: "created",
      details: `${title}`,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update existing note
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { title, content },
      { new: true }
    );

    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "note",
      action: "updated",
      details: `${updatedNote.title}`,
    });

    res.json(updatedNote);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete note
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Note.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!deleted)
      return res.status(404).json({ message: "Note not found" });

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "note",
      action: "deleted",
      details: `${deleted.title}`,
    });

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Toggle pin/unpin note
router.patch("/:id/pin", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.pinned = !note.pinned;
    await note.save();

    // 🆕 Log activity
    await Activity.create({
      userId: req.userId,
      type: "note",
      action: note.pinned ? "pinned" : "unpinned",
      details: `${note.title}`,
    });

    res.status(200).json({
      message: note.pinned ? "Note pinned successfully" : "Note unpinned successfully",
      note,
    });
  } catch (err) {
    console.error("Error toggling pin:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
