import winston from "winston";

// Standard-Logger
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/application.log",
      format: winston.format.combine(winston.format.uncolorize(), winston.format.timestamp(), winston.format.json()),
    }),
  ],
});

// Audit-Logger
export const auditLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.File({ filename: "logs/audit.log" })],
});
