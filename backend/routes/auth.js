const express = require("express");
const {
  register,
  login,
  verifyToken,
  googleAuth,
} = require("../controllers/authController");

const router = express.Router();

// POST /auth/register
router.post("/register", register);

// POST /auth/login
router.post("/login", login);

// GET /auth/verify
router.get("/verify", verifyToken);

// POST /auth/google-auth
router.post("/google-auth", googleAuth);

module.exports = router;
