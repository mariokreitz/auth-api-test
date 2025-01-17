import express from "express";
import { getProfile, updateUser, updateProfilePicture, logout } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", getProfile);
router.put("/profile/update", updateUser);
router.put("/profile/update/picture", updateProfilePicture);
router.post("/logout", logout);

export default router;
