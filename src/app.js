import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Auth API is up and running!");
});

export default app;
