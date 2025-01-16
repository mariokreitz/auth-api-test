import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";
import sendPasswordResetEmail from "../utils/sendPasswordResetEmail.js";
import { logAudit } from "../service/audit.service.js";

/**
 * @description Register a new user
 * @route POST /auth/register
 * @param {string} username - Username chosen by user
 * @param {string} email - Email of user
 * @param {string} password - Password chosen by user
 * @returns {object} JSON response with a message
 * @example
 * // Request
 * POST /auth/register HTTP/1.1
 * Content-Type: application/json
 * {
 *   "username": "testuser",
 *   "email": "testuser@example.com",
 *   "password": "testpassword"
 * }
 * // Response
 * HTTP/1.1 201 Created
 * {
 *   "message": "User registered successfully. Please check your email to verify your account."
 * }
 */
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    await sendVerificationEmail(user, verificationToken);
    res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Login a user
 * @route POST /auth/login
 * @param {string} email - Email of user
 * @param {string} password - Password of user
 * @returns {object} JSON response with a message and a token
 * @example
 * // Request
 * POST /auth/login HTTP/1.1
 * Content-Type: application/json
 * {
 *   "email": "testuser@example.com",
 *   "password": "testpassword"
 * }
 * // Response
 * HTTP/1.1 200 OK
 * {
 *   "message": "Login successful",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTYyNjkwMjU4ODU4IiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjM3NjY2NjY0fQ.WpXnHt0j4jV3tqZQZKU0J4C9p0mZ4J3J2N1M0YzQ1NjM2MzIxMjUiLCJleHAiOjE2Mzc2NzA2NjR9.SDk1aW1hbmh0ZmFtaWxpY2F0aW9u"
 * }
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logAudit("unknown", "failed_login", `Email=${email}`, req.ip);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email" });
    }

    const payload = {
      userId: user._id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 3600000, // 1 hour
    });

    await logAudit(user.username, "successful_login", `Email=${email}`, req.ip);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    await logAudit("unknown", "login_error", error.message, req.ip);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @description Verify a user's email address
 * @route GET /auth/verify-email
 * @param {string} token - Verification token sent in the email
 * @returns {object} JSON response with a message
 * @example
 * // Request
 * GET /auth/verify-email?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTYyNjkwMjU4ODU4IiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjM3NjY2NjY0fQ.WpXnHt0j4jV3tqZQZKU0J4C9p0mZ4J3J2N1M0YzQ1NjM2MzIxMjUiLCJleHAiOjE2Mzc2NzA2NjR9.SDk1aW1hbmh0ZmFtaWxpY2F0aW9u HTTP/1.1
 * // Response
 * HTTP/1.1 200 OK
 * {
 *   "message": "Email verified successfully"
 * }
 */
export const verifyEmail = async (req, res) => {
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
};

/**
 * @description Request a password reset for a user
 * @route POST /auth/request-password-reset
 * @param {string} email - Email of the user requesting password reset
 * @returns {object} JSON response with a success message or an error message
 * @example
 * // Request
 * POST /auth/request-password-reset HTTP/1.1
 * Content-Type: application/json
 * {
 *   "email": "user@example.com"
 * }
 * // Response
 * HTTP/1.1 200 OK
 * {
 *   "message": "Password reset link sent. Please check your email."
 * }
 */

export const requestPasswordReset = async (req, res) => {
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
};

/**
 * @description Reset a user's password
 * @route POST /auth/reset-password
 * @param {string} password - New password chosen by user
 * @param {string} token - Password reset token sent in the email
 * @returns {object} JSON response with a success message
 * @example
 * // Request
 * POST /auth/reset-password HTTP/1.1
 * Content-Type: application/json
 * {
 *   "password": "newpassword",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTYyNjkwMjU4ODU4IiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjM3NjY2NjY0fQ.WpXnHt0j4jV3tqZQZKU0J4C9p0mZ4J3J2N1M0YzQ1NjM2MzIxMjUiLCJleHAiOjE2Mzc2NzA2NjR9.SDk1aW1hbmh0ZmFtaWxpY2F0aW9u"
 * }
 * // Response
 * HTTP/1.1 200 OK
 * {
 *   "message": "Password successfully reset"
 * }
 */
export const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.status(200).json({ message: "Password successfully reset" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
