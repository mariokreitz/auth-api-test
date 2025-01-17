import express from "express";
import { deleteUser, getAllUsers, createUser, updateUser } from "../controllers/admin.controller.js";
import { getAuditLogs } from "../controllers/audit.controller.js";
import verifyRole from "../middleware/verifyRole.middleware.js";
import { auditMiddleware } from "../middleware/audit.middleware.js";

const router = express.Router();

router.get("/users", verifyRole("admin"), auditMiddleware("admin_access_users"), getAllUsers);
router.post("/users/create", verifyRole("admin"), auditMiddleware("admin_create_user"), createUser);
router.delete("/users/delete", verifyRole("admin"), auditMiddleware("admin_delete_user"), deleteUser);
router.put("/users/update", verifyRole("admin"), auditMiddleware("admin_update_user"), updateUser);

router.get("/audit", verifyRole("admin"), auditMiddleware("admin_access_audit"), getAuditLogs);

export default router;
