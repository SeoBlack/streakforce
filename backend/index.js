const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const habitRoutes = require("./routes/habits");
const checkInRoutes = require("./routes/checkins");
const aiRoutes = require("./routes/ai");

// Routes
app.get("/", (req, res) => {
  res.send("StreakForce API is running!");
});

// API Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/habits", habitRoutes);
app.use("/checkins", checkInRoutes);
app.use("/ai", aiRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
