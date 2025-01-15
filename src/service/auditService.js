import Audit from "../models/auditModel.js";
import { auditLogger } from "../config/logger.js";

export const logAudit = async (user, action, details, ip) => {
  try {
    await Audit.create({ user, action, details, ip });

    auditLogger.info({
      user,
      action,
      details,
      ip,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    auditLogger.error(`Failed to log audit: ${error.message}`);
  }
};
