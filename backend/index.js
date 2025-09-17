const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const habitRoutes = require("./routes/habits");
const teamRoutes = require("./routes/teams");
const checkInRoutes = require("./routes/checkins");
const progressRoutes = require("./routes/progress");
const challengeRoutes = require("./routes/challenges");

// Routes
app.get("/", (req, res) => {
  res.send("StreakForce API is running!");
});

// API Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/habits", habitRoutes);
app.use("/teams", teamRoutes);
app.use("/checkins", checkInRoutes);
app.use("/progress", progressRoutes);
app.use("/challenges", challengeRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
