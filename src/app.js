import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { auditMiddleware } from "./middleware/auditMiddleware.js";
import requestLogger from "./middleware/requestLogger.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);
app.use(errorHandler);

app.use("/session", sessionRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", auditMiddleware("access_admin"), adminRoutes);

app.get("/", (req, res) => {
  res.send("Auth API is up and running!");
});

export default app;
