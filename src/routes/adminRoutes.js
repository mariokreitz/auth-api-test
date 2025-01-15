import express from "express";
import { deleteUser, updateUserRole, getAllUsers } from "../controllers/adminController.js";
import { getAuditLogs } from "../controllers/auditController.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyRole from "../middleware/verifyRole.js";

const router = express.Router();

router.get("/users", verifyToken, verifyRole("admin"), getAllUsers);
router.delete("/users/:userId", verifyToken, verifyRole("admin"), deleteUser);
router.put("/users/role", verifyToken, verifyRole("admin"), updateUserRole);

router.get("/audit", verifyToken, verifyRole("admin"), getAuditLogs);

export default router;
