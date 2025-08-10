const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// 🧠 Define the user schema
const userSchema = new mongoose.Schema(
  {
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

    // ✅ Avatar fields
    avatarUrl: {
      type: String,
      default: "",
      trim: true,
    },
    avatarPublicId: {
      type: String,
      default: "",
      trim: true,
    },

    // ✅ For password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true } // createdAt, updatedAt
);

// 🔐 Automatically hash password before saving (only if modified and not already hashed)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Prevent rehashing if already hashed
  const isAlreadyHashed = typeof this.password === "string" && this.password.startsWith("$2b$");
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
  return bcrypt.compare(candidatePassword, this.password);
};

// 🧽 Clean JSON output (hide sensitive fields)
userSchema.methods.toJSON = function () {
  const obj = this.toObject({ versionKey: false });
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

// ✅ Export the model
const User = mongoose.model("User", userSchema);
module.exports = User;
