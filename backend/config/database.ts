import mysql from "mysql2/promise"
import { config } from "./config"
import { logger } from "../utils/logger"

let connection: mysql.Connection

export const connectDatabase = async (): Promise<void> => {
  try {
    connection = await mysql.createConnection({
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
      timezone: "+00:00",
      dateStrings: true,
    })

    // Test the connection
    await connection.ping()
    logger.info("MySQL database connected successfully")

    // Create tables if they don't exist
    await createTables()
  } catch (error) {
    logger.error("Database connection failed:", error)
    throw error
  }
}

export const getConnection = (): mysql.Connection => {
  if (!connection) {
    throw new Error("Database not connected")
  }
  return connection
}

const createTables = async (): Promise<void> => {
  try {
    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'admin') NOT NULL,
        college VARCHAR(255) NOT NULL,
        is_approved BOOLEAN DEFAULT FALSE,
        profile_picture VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Jobs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT,
        location VARCHAR(255) NOT NULL,
        job_type ENUM('full-time', 'part-time', 'internship', 'contract') DEFAULT 'full-time',
        salary_range VARCHAR(100),
        deadline DATE NOT NULL,
        status ENUM('active', 'closed', 'draft') DEFAULT 'active',
        posted_by INT NOT NULL,
        college VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Applications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        user_id INT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        cover_letter TEXT,
        resume_url VARCHAR(255),
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_application (job_id, user_id)
      )
    `)

    // Notifications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    logger.info("Database tables created/verified successfully")
  } catch (error) {
    logger.error("Error creating tables:", error)
    throw error
  }
}

export const closeConnection = async (): Promise<void> => {
  if (connection) {
    await connection.end()
    logger.info("Database connection closed")
  }
}
