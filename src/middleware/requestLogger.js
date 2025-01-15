import { logger } from "../config/logger.js";

const requestLogger = (req, res, next) => {
  logger.info(`Incoming Request: ${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    headers: req.headers,
    ip: req.ip,
  });
  next();
};

export default requestLogger;
