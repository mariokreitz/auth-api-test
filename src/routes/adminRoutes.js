import express from "express";
import { deleteUser, updateUserRole } from "../controllers/adminController.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyRole from "../middleware/verifyRole.js";
import { getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/users", verifyToken, verifyRole("admin"), getAllUsers);
router.delete("/users/:userId", verifyToken, verifyRole("admin"), deleteUser);
router.put("/users/role", verifyToken, verifyRole("admin"), updateUserRole);

export default router;
