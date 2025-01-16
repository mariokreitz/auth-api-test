import express from "express";
import { deleteUser, updateUserRole, getAllUsers } from "../controllers/admin.controller.js";
import { getAuditLogs } from "../controllers/audit.controller.js";
import verifyRole from "../middleware/verifyRole.middleware.js";

const router = express.Router();

router.get("/users", verifyRole("admin"), getAllUsers);
router.delete("/users/:userId", verifyRole("admin"), deleteUser);
router.put("/users/role", verifyRole("admin"), updateUserRole);

router.get("/audit", verifyRole("admin"), getAuditLogs);

export default router;
