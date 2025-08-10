// routes/user-routes.js
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware"); // JWT guard
const { upload } = require("../helpers/cloudinary");            // Multer instance
const {
  uploadMyAvatar,
  removeMyAvatar,
} = require("../controllers/user.controller");                  // Controller handlers

// Upload avatar for the logged-in user
router.post("/me/avatar", authMiddleware, upload.single("avatar"), uploadMyAvatar);

// Remove avatar for the logged-in user
router.delete("/me/avatar", authMiddleware, removeMyAvatar);

module.exports = router;
