const express = require("express");
const { getUserProgress } = require("../controllers/progressController");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /progress/:userId
router.get("/:userId", auth, getUserProgress);

module.exports = router;
