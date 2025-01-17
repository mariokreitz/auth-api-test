import rateLimit from "express-rate-limit";

export const passwordRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Maximum 3 requests within 15 minutes
  message: "Too many reset password requests from this IP, please try again later.",
});

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
