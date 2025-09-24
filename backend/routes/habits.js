const express = require("express");
const {
  createHabit,
  getHabitDetails,
} = require("../controllers/habitController");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /habits
router.post("/", auth, createHabit);

// GET /habits/:id
router.get("/:id", auth, getHabitDetails);

module.exports = router;
