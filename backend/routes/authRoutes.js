const express = require("express");
const router = express.Router();

// ✅ Import controller functions
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");

// ✅ Import auth middleware to protect private routes
const authMiddleware = require("../middleware/authMiddleware");

// 🔐 Auth Routes

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login user and return token
router.post("/login", login);

// @route   GET /api/auth/me
// @desc    Get logged in user info
// @access  Private
router.get("/me", authMiddleware, getMe);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset link via email
router.post("/forgot-password", forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password using token
router.post("/reset-password/:token", resetPassword);

// @route   POST /api/auth/change-password
// @desc    Change password for logged-in user
// @access  Private
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
