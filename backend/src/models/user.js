const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  imagePath: { type: String, required: true },
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Users", userSchema);
