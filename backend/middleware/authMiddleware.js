// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// 🔐 Middleware to verify JWT token and protect private routes
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Usually contains user ID
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyToken;
