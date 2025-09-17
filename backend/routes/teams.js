const express = require("express");
const { createTeam, getTeamDetails } = require("../controllers/teamController");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /teams
router.post("/", auth, createTeam);

// GET /teams/:id
router.get("/:id", auth, getTeamDetails);

module.exports = router;
