import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import rateLimit from "express-rate-limit";

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Maximum 3 requests within 15 minutes
  message: "Too many reset password requests from this IP, please try again later.",
});

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter);

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Auth API is up and running!");
});

export default app;
