import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getUserRole } from "../controllers/sessionController.js";

const router = express.Router();

router.get("/", verifyToken, getUserRole);

export default router;
