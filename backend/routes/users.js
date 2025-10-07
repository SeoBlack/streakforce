const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserAllHabits,
  getUserProgress,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /users/:id
router.get("/:id", auth, getUserProfile);

// PUT /users/:id
router.put("/:id", auth, updateUserProfile);

// GET /users
router.get("/", getAllUsers);

// GET /users all habits
router.get("/habits/:userId", auth, getUserAllHabits);

router.get("/progress/:userId", auth, getUserProgress);

module.exports = router;
