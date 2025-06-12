import dotenv from "dotenv"

dotenv.config()

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number.parseInt(process.env.PORT || "5000", 10),

  // Database configuration
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number.parseInt(process.env.DB_PORT || "3306", 10),
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "job_portal",

  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  // Email configuration (for future use)
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: Number.parseInt(process.env.EMAIL_PORT || "587", 10),
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  // File upload configuration
  MAX_FILE_SIZE: Number.parseInt(process.env.MAX_FILE_SIZE || "5242880", 10), // 5MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || "./uploads",
}

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "DB_HOST", "DB_USER", "DB_NAME"]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}
