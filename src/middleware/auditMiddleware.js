import { logAudit } from "../service/auditService.js";

export const auditMiddleware = (action) => {
  return (req, res, next) => {
    const user = req.user?.username || "Guest";
    const ip = req.ip;

    logAudit(user, action, `Accessed ${req.originalUrl}`, ip);
    next();
  };
};
