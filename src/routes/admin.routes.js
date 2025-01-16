import express from "express";
import { deleteUser, updateUserRole, getAllUsers } from "../controllers/admin.controller.js";
import { getAuditLogs } from "../controllers/audit.controller.js";
import verifyRole from "../middleware/verifyRole.middleware.js";
import { auditMiddleware } from "../middleware/audit.middleware.js";

const router = express.Router();

router.get("/users", verifyRole("admin"), auditMiddleware("admin_access_users"), getAllUsers);
router.delete("/users", verifyRole("admin"), auditMiddleware("admin_delete_user"), deleteUser);
router.put("/users/role", verifyRole("admin"), auditMiddleware("admin_update_user_role"), updateUserRole);

router.get("/audit", verifyRole("admin"), auditMiddleware("admin_access_audit"), getAuditLogs);

export default router;
