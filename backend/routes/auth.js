const express = require("express");
const {
  register,
  login,
  verifyToken,
  googleAuth,
  forgotPassword,
  resetPassword,
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

// POST /auth/forgot-password
router.post("/forgot-password", forgotPassword);

// POST /auth/reset-password?token=
router.post("/reset-password/:token", resetPassword);

module.exports = router;
