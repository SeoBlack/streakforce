const express = require("express");
const { executeAiQuery } = require("../controllers/aiController");

const router = express.Router();

// POST /ai/execute-ai-query
router.post("/query", executeAiQuery);

module.exports = router;
