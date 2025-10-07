const express = require("express");
const { executeAiQuery } = require("../controllers/aiController");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /ai/query - Protected route
router.post("/query", auth, executeAiQuery);

module.exports = router;
