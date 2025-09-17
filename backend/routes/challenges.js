const express = require("express");
const {
  createChallenge,
  getChallengeDetails,
} = require("../controllers/challengeController");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /challenges
router.post("/", auth, createChallenge);

// GET /challenges/:id
router.get("/:id", auth, getChallengeDetails);

module.exports = router;
