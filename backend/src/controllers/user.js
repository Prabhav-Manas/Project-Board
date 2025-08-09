const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/mailer");
const crypto = require("crypto");

// Signup
exports.createUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Invalid Input",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Invalid Image",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const url = req.protocol + "://" + req.get("host");

    const newUser = new User({
      email,
      password: hashPassword,
      imagePath: url + "/images/" + req.file.filename,
    });

    // ---Generate a unique verification token---
    const verificationToken = crypto.randomBytes(32).toString("hex");
    newUser.verificationToken = verificationToken;
    newUser.isVerified = false;

    await newUser.save();

    // ---Construct the verification link---
    const verificationLink = `http://localhost:9000/api/users/verify-email/${verificationToken}`;

    // ---Use the mailer module to send the email---
    await sendVerificationEmail(newUser.email, verificationLink);

    res.status(201).json({
      message: "Registration Successful! Verification link sent to your email.",
      userId: newUser._id,
    });
  } catch (error) {
    console.log("Error 💥:=>", error.message);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

// Verify Email
exports.verifyEmail = async (req, res, next) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = "";
    await user.save();

    res.status(200).json({
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.log("Error in verification email 💥:=>", error.message);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

// Signin
exports.signInUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Invalid Input!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const payload = {
      user: {
        id: user._id,
        userName: user.email,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Signin Successful",
      token: token,
      expiresIn: 3600,
      user: {
        id: user._id,
        email: user.email,
        imagePath: user.imagePath, // Include image path in response
      },
    });
  } catch (error) {
    console.log("Error 💥:=>", error);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

// Forgot-Password
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000;

    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;

    await sendResetPasswordEmail(user.email, resetLink);

    res.status(200).json({
      message: "Password reset link sent.",
    });
  } catch (error) {
    console.log("Error in forgot-password 💥:=>", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Reset-Password
exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Invalid Input!",
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = "";
    user.resetTokenExpiration = "";

    await user.save();

    res.status(200).json({
      message: "Password reset successful!",
    });
  } catch (error) {
    console.log("Error in Password Reset 💥:=>", error.message);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};
