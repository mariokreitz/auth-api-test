import express from "express";
import { getUserRole } from "../controllers/session.controller.js";

const router = express.Router();

router.get("/", getUserRole);

export default router;
