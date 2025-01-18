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
import { limiter } from "./middleware/requestLimiter.middleware.js";
import session from "express-session";

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ChuckNorrisWillBeMyGuard",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// CSRF protection middleware
// app.use(lusca.csrf());
// app.use((req, res, next) => {
//   const csrfToken = req.csrfToken();
//   res.locals.csrfToken = csrfToken;
//   next();
// });

// Custom middleware
app.use(requestLogger);
app.use(errorHandler);
app.use(limiter);

// Routes
app.use("/auth", authRoutes);
app.use("/session", verifyToken, sessionRoutes);
app.use("/user", verifyToken, userRoutes);
app.use("/admin", verifyToken, adminRoutes);

// Default route
app.get("/", (req, res) => {
  try {
    // const csrfToken = req.csrfToken();

    // res.cookie("csrfToken", csrfToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "None",
    //   maxAge: 3600000, // 1 Stunde
    // });

    // res.status(200).json({
    //   message: "CSRF Token gesetzt und Anfrage erfolgreich",
    // });
    res.status(200).json({
      message: "API is up and running!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default app;
