const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const jwt = require("jsonwebtoken");

// ✅ Verify Token
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
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ✅ Get all activities
router.get("/", verifyToken, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get recent (last 10) activities
router.get("/recent", verifyToken, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(activities);
  } catch (err) {
    console.error("Error fetching recent activities:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
