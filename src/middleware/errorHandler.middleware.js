import { logger } from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
  });

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
};

export default errorHandler;
