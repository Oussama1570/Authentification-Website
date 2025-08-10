require("dotenv").config(); // ✅ Load environment variables

const User = require("../models/Users.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");

// 📧 Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ DEBUG: Show if email credentials are loaded correctly
console.log("📨 Using Gmail:", process.env.EMAIL_USER);
console.log("🔑 App password length:", process.env.EMAIL_PASS?.length);



// ✅ Register a new user
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ msg: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token, // (you can also rename to accessToken for consistency)
      user: {
        id: user._id,
        email: user.email,
        avatarUrl: user.avatarUrl || "",
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Registration failed" });
  }
};




const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        avatarUrl: user.avatarUrl || "",       // ✅ include avatar
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};




// Add refresh token generation
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

// 🔐 Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // set true in production
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // ✅ include avatar so the header/profile can render it right after login
  res.json({
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      avatarUrl: user.avatarUrl || "",
    },
  });
};



// Refresh token
const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ msg: "Invalid refresh token" });
  }
};

// Logout: clear cookie
const logout = (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === "production" });
  res.json({ msg: "Logged out" });
};





// ✅ Forgot password - send reset link via email

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate and hash token
    const rawToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${rawToken}`;

    await transporter.sendMail({
  from: '"AuthApp Support" <' + process.env.EMAIL_USER + '>', // ✅ name + email
  to: email,
  subject: "Reset your password",
  html: `
    <p>Hello,</p>
    <p>You requested to reset your password.</p>
    <p>
      <a href="${resetUrl}" target="_blank" style="color: #1a73e8;">Click here to reset your password</a>
    </p>
    <p>If you didn’t request this, you can ignore this email.</p>
    <br/>
    <p>— The AuthApp Team</p>
  `,
});


    res.json({ msg: "Password reset link sent!" });
  } catch (err) {
    console.error("❌ Forgot password error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};



// ✅ Reset password - update password with new hash
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Hash the token from the URL to compare it
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user by the hashed token and check expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Change password for logged-in user
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ msg: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10); //
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


module.exports = {
  register,
  login,
  logout,
  refresh, 
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
};

