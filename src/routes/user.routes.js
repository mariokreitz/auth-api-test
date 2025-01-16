import express from "express";
import { getProfile, updateProfile, updateProfilePicture, logout } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/profile/picture", updateProfilePicture);
router.post("/logout", logout);

export default router;
