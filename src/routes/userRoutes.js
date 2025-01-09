import express from "express";
import { getProfile, updateProfile, updateProfilePicture, logout } from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.put("/profile/picture", verifyToken, updateProfilePicture);
router.post("/logout", logout);

export default router;
