const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// 🧠 Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },

  // ✅ For password reset
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// 🔐 Automatically hash password before saving (only if modified and not already hashed)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Prevent rehashing if already hashed
  const isAlreadyHashed = this.password.startsWith("$2b$");
  if (isAlreadyHashed) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔎 Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ✅ Export the model
const User = mongoose.model("User", userSchema);
module.exports = User;
