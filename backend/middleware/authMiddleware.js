const jwt = require("jsonwebtoken");

// 🔐 Middleware to verify JWT token and protect private routes
const verifyToken = (req, res, next) => {
  // ⛔️ Get token from Authorization header (e.g., Bearer <token>)
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    // ✅ Decode token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧠 Attach decoded payload to request object (usually { id })
    req.user = decoded;

    next(); // 🔁 Pass control to next middleware/route
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = verifyToken;
