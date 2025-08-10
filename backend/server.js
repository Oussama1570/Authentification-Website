const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/user-routes"); // ⬅️ NEW: avatar upload/remove routes

const app = express();

// --- Config ---
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

// If you deploy behind a proxy (Railway/Render/Vercel), keep cookies & IPs correct
app.set("trust proxy", 1);

// --- Middleware ---
app.use(express.json({ limit: "1mb" })); // JSON only (files handled by multer)
app.use(cookieParser());

// CORS with credentials (for httpOnly refresh cookie + Authorization header)
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Quick healthcheck
app.get("/api/health", (_req, res) => res.status(200).json({ ok: true }));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // ⬅️ NEW

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralized error handler (incl. Multer errors)
app.use((err, _req, res, _next) => {
  // Multer file-size or validation errors
  if (err && err.name === "MulterError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  console.error("Unhandled error:", err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Server error" });
});

// --- DB + boot ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
