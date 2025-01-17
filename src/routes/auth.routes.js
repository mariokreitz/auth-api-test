import express from "express";
import { body } from "express-validator";
import * as authController from "../controllers/auth.controller.js";
import { requestPasswordReset } from "../middleware/requestLimiter.middleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  authController.register
);

router.post(
  "/login",
  [body("email").isEmail().withMessage("Valid email is required"), body("password").notEmpty().withMessage("Password is required")],
  authController.login
);

router.get("/verify-email", authController.verifyEmail);

router.post(
  "/request-password-reset",
  requestPasswordReset,
  [body("email").isEmail().withMessage("Valid email is required")],
  authController.requestPasswordReset
);

router.post(
  "/reset-password",
  [
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("token").notEmpty().withMessage("Token is required"),
  ],
  authController.resetPassword
);

export default router;
