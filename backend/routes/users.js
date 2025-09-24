const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /users/:id
router.get("/:id", auth, getUserProfile);

// PUT /users/:id
router.put("/:id", auth, updateUserProfile);

module.exports = router;
