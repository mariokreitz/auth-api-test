import express from "express";
import { getProfile, updateProfile, updateProfilePicture, getAllUsers } from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyRole from "../middleware/verifyRole.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.put("/profile/picture", verifyToken, updateProfilePicture);

// (Admin only)
router.get("/all-users", verifyToken, verifyRole("admin"), getAllUsers);

export default router;
