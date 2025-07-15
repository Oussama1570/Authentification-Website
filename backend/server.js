// 🌐 Import necessary packages
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// 📦 Import authentication routes
const authRoutes = require("./routes/authRoutes");

// 🔐 Load environment variables from .env file
dotenv.config();

// 🚀 Initialize Express app
const app = express();

// 🔄 Middleware
app.use(cors());              // Enable Cross-Origin requests
app.use(express.json());      // Parse incoming JSON bodies

// 📎 Test route for health check
app.get("/", (req, res) => {
  res.send("🚀 Backend API is running");
});

// ✅ Auth routes (e.g., /api/auth/register, /api/auth/login)
app.use("/api/auth", authRoutes);

// 🔗 Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    // Start server on port 5000
    app.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
