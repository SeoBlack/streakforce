const express = require("express");
const {
  createHabit,
  getHabitDetails,
  getAllHabits,
  deleteHabit ,
} = require("../controllers/habitController");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /habits
router.post("/", auth, createHabit);

// GET /habits/:id
router.get("/:id", auth, getHabitDetails);

// GET /habits
router.get("/", getAllHabits);

// DELETE /habits/:id
router.delete("/:id", auth, deleteHabit );

module.exports = router;
