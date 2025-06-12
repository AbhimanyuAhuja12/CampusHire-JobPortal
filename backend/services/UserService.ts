import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getConnection } from "../config/database"
import type { User, CreateUserData, UpdateUserData, LoginCredentials } from "../models/User"
import { config } from "../config/config"
import { createError } from "../middleware/errorHandler"
import { StatusCodes } from "../utils/httpStatusCodes"
import { logger } from "../utils/logger"

export class UserService {
  static async create(userData: CreateUserData): Promise<{ user: Omit<User, "password">; token: string }> {
    const connection = getConnection()

    try {
      // Check if user already exists
      const [existingUsers] = (await connection.execute("SELECT id FROM users WHERE email = ?", [
        userData.email,
      ])) as any[]

      if (existingUsers.length > 0) {
        throw createError("User with this email already exists", StatusCodes.CONFLICT)
      }

      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

      // Create user
      const [result] = (await connection.execute(
        `INSERT INTO users (name, email, password, role, college, is_approved) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userData.name,
          userData.email,
          hashedPassword,
          userData.role,
          userData.college,
          userData.role === "admin", // Auto-approve admins
        ],
      )) as any[]

      const userId = result.insertId

      // Get created user
      const [users] = (await connection.execute(
        "SELECT id, name, email, role, college, is_approved, created_at FROM users WHERE id = ?",
        [userId],
      )) as any[]

      const user = users[0]

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
      })

      logger.info(`User created successfully: ${user.email}`)

      return { user, token }
    } catch (error) {
      logger.error("Error creating user:", error)
      throw error
    }
  }

  static async login(credentials: LoginCredentials): Promise<{ user: Omit<User, "password">; token: string }> {
    const connection = getConnection()

    try {
      // Find user by email and role
      const [users] = (await connection.execute("SELECT * FROM users WHERE email = ? AND role = ?", [
        credentials.email,
        credentials.role,
      ])) as any[]

      if (users.length === 0) {
        throw createError("Invalid credentials", StatusCodes.UNAUTHORIZED)
      }

      const user = users[0]

      // Verify password
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
      if (!isPasswordValid) {
        throw createError("Invalid credentials", StatusCodes.UNAUTHORIZED)
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
      })

      // Remove password from user object
      const { password, ...userWithoutPassword } = user

      logger.info(`User logged in successfully: ${user.email}`)

      return { user: userWithoutPassword, token }
    } catch (error) {
      logger.error("Error during login:", error)
      throw error
    }
  }

  static async findById(id: number): Promise<Omit<User, "password"> | null> {
    const connection = getConnection()

    try {
      const [users] = (await connection.execute(
        "SELECT id, name, email, role, college, is_approved, profile_picture, created_at, updated_at FROM users WHERE id = ?",
        [id],
      )) as any[]

      return users.length > 0 ? users[0] : null
    } catch (error) {
      logger.error("Error finding user by ID:", error)
      throw error
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    const connection = getConnection()

    try {
      const [users] = (await connection.execute("SELECT * FROM users WHERE email = ?", [email])) as any[]

      return users.length > 0 ? users[0] : null
    } catch (error) {
      logger.error("Error finding user by email:", error)
      throw error
    }
  }

  static async update(id: number, updateData: UpdateUserData): Promise<Omit<User, "password">> {
    const connection = getConnection()

    try {
      const updateFields: string[] = []
      const updateValues: any[] = []

      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = ?`)
          updateValues.push(value)
        }
      })

      if (updateFields.length === 0) {
        throw createError("No fields to update", StatusCodes.BAD_REQUEST)
      }

      updateValues.push(id)

      await connection.execute(
        `UPDATE users SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        updateValues,
      )

      const updatedUser = await this.findById(id)
      if (!updatedUser) {
        throw createError("User not found", StatusCodes.NOT_FOUND)
      }

      logger.info(`User updated successfully: ${updatedUser.email}`)

      return updatedUser
    } catch (error) {
      logger.error("Error updating user:", error)
      throw error
    }
  }

  static async getPendingStudents(college: string): Promise<Omit<User, "password">[]> {
    const connection = getConnection()

    try {
      const [users] = (await connection.execute(
        `SELECT id, name, email, role, college, is_approved, created_at 
         FROM users 
         WHERE role = 'student' AND is_approved = FALSE AND college = ?
         ORDER BY created_at DESC`,
        [college],
      )) as any[]

      return users
    } catch (error) {
      logger.error("Error getting pending students:", error)
      throw error
    }
  }

  static async approveStudent(id: number, adminCollege: string): Promise<void> {
    const connection = getConnection()

    try {
      // Verify student exists and belongs to the same college
      const [students] = (await connection.execute(
        'SELECT id, college FROM users WHERE id = ? AND role = "student" AND college = ?',
        [id, adminCollege],
      )) as any[]

      if (students.length === 0) {
        throw createError("Student not found or not from your college", StatusCodes.NOT_FOUND)
      }

      // Approve the student
      await connection.execute("UPDATE users SET is_approved = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [id])

      logger.info(`Student approved successfully: ID ${id}`)
    } catch (error) {
      logger.error("Error approving student:", error)
      throw error
    }
  }

  static async getStats(college?: string): Promise<any> {
    const connection = getConnection()

    try {
      let query = `
        SELECT 
          COUNT(*) as total_users,
          SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as total_students,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as total_admins,
          SUM(CASE WHEN role = 'student' AND is_approved = TRUE THEN 1 ELSE 0 END) as approved_students,
          SUM(CASE WHEN role = 'student' AND is_approved = FALSE THEN 1 ELSE 0 END) as pending_students
        FROM users
      `

      const params: any[] = []

      if (college) {
        query += " WHERE college = ?"
        params.push(college)
      }

      const [stats] = (await connection.execute(query, params)) as any[]

      return stats[0]
    } catch (error) {
      logger.error("Error getting user stats:", error)
      throw error
    }
  }
}
