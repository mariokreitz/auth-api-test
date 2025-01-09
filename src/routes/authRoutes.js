import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";

const router = express.Router();
router.use(cookieParser());

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await User.create({ username, email, password });

      const verificationToken = crypto.randomBytes(20).toString("hex");
      user.verificationToken = verificationToken;
      await user.save();

      await sendVerificationEmail(user, verificationToken);

      res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail().withMessage("Valid email is required"), body("password").notEmpty().withMessage("Password is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      if (!user.isVerified) {
        return res.status(400).json({ message: "Please verify your email" });
      }

      const payload = { userId: user._id, username: user.username };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour
      });

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: "Invalid token" });
  }

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/request-password-reset", [body("email").isEmail().withMessage("Valid email is required")], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found with this email address" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour

    await user.save();

    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json({ message: "Password reset link sent. Please check your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
