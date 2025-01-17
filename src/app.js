import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import lusca from "lusca";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import requestLogger from "./middleware/requestLogger.middleware.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import verifyToken from "./middleware/verifyToken.middleware.js";

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
app.use(lusca.csrf());
app.use(requestLogger);
app.use(errorHandler);

app.use("/auth", authRoutes);
app.use("/session", verifyToken, sessionRoutes);
app.use("/user", verifyToken, userRoutes);
app.use("/admin", verifyToken, adminRoutes);

app.get("/", (req, res) => {
  res.send("Auth API is up and running!");
});

export default app;
