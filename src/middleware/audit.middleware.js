import { logAudit } from "../service/audit.service.js";

export const auditMiddleware = (action) => {
  return (req, res, next) => {
    const { username } = req.user;

    const user = username || "Guest";
    const ip = req.ip;

    logAudit(user, action, `Accessed ${req.originalUrl}`, ip);
    next();
  };
};
