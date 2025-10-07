const express = require("express");
const {
  getUserProfileById,
  updateMyProfile,
  getMyProfile,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /users/profile - Get current user's profile
router.get("/profile", auth, getMyProfile);

// PUT /users/profile - Update current user's profile
router.put("/profile", auth, updateMyProfile);

// GET /users/:id
router.get("/:id", auth, getUserProfileById);

module.exports = router;
