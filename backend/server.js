const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const taskRoutes = require("./routes/tasks");
const habitRoutes = require("./routes/habits");
const expensesRoutes = require("./routes/expenses");
const dashboardRoutes = require("./routes/dashboard");
const activityRoutes = require("./routes/activityRoutes");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI,)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/dashboard-summary", dashboardRoutes);
app.use("/api/activities", activityRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
