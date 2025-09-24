const express = require("express");
const { submitCheckIn } = require("../controllers/checkInController");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /checkins
router.post("/", auth, submitCheckIn);

module.exports = router;
