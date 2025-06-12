import winston from "winston"
import path from "path"
import { config } from "../config/config"

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
}

// Tell winston that you want to link the colors
winston.addColors(colors)

// Define which logs to print based on environment
const level = (): string => {
  const env = config.NODE_ENV || "development"
  const isDevelopment = env === "development"
  return isDevelopment ? "debug" : "warn"
}

// Define different log formats
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
)

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console({
    format: format,
  }),

  // File transport for errors
  new winston.transports.File({
    filename: path.join("logs", "error.log"),
    level: "error",
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  }),

  // File transport for all logs
  new winston.transports.File({
    filename: path.join("logs", "combined.log"),
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  }),
]

// Create the logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false,
})

// Create logs directory if it doesn't exist
import fs from "fs"
const logsDir = "logs"
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

// Stream object for Morgan HTTP request logging
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim())
  },
}
