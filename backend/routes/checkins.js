const express = require("express");
const {
  submitCheckIn,
  getCheckIns,
  getCheckInsByHabitId,
} = require("../controllers/checkInController");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /checkins
router.post("/", auth, submitCheckIn);
// GET /checkins
router.get("/", auth, getCheckIns);
// GET /checkins/habit/:habitId
router.get("/habit/:habitId", auth, getCheckInsByHabitId);

module.exports = router;
