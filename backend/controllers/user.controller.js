// controllers/user.controller.js
const User = require("../models/Users.js"); // ✅ singular file name
const { cloudinary, uploadBufferToCloudinary } = require("../helpers/cloudinary.js");

const uploadMyAvatar = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; // support either shape
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const result = await uploadBufferToCloudinary(req.file.buffer, "authapp/avatars");

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.avatarPublicId) {
      try { await cloudinary.uploader.destroy(user.avatarPublicId); } catch (_) {}
    }

    user.avatarUrl = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Avatar updated",
      user: { id: user._id, email: user.email, avatarUrl: user.avatarUrl },
    });
  } catch (err) {
    console.error("uploadMyAvatar error:", err);
    res.status(500).json({ success: false, message: "Failed to upload avatar" });
  }
};

const removeMyAvatar = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.avatarPublicId) {
      try { await cloudinary.uploader.destroy(user.avatarPublicId); } catch (_) {}
    }

    user.avatarUrl = "";
    user.avatarPublicId = "";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Avatar removed",
      user: { id: user._id, email: user.email, avatarUrl: user.avatarUrl },
    });
  } catch (err) {
    console.error("removeMyAvatar error:", err);
    res.status(500).json({ success: false, message: "Failed to remove avatar" });
  }
};

module.exports = { uploadMyAvatar, removeMyAvatar };
