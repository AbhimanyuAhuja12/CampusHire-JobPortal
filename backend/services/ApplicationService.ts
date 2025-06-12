import { getConnection } from "../config/database"
import type {
  Application,
  CreateApplicationData,
  UpdateApplicationData,
  ApplicationWithDetails,
} from "../models/Application"
import { createError } from "../middleware/errorHandler"
import { StatusCodes } from "../utils/httpStatusCodes"
import { logger } from "../utils/logger"

export class ApplicationService {
  static async create(applicationData: CreateApplicationData, userId: number): Promise<Application> {
    const connection = getConnection()

    try {
      // Check if user already applied for this job
      const [existingApplications] = (await connection.execute(
        "SELECT id FROM applications WHERE job_id = ? AND user_id = ?",
        [applicationData.job_id, userId],
      )) as any[]

      if (existingApplications.length > 0) {
        throw createError("You have already applied for this job", StatusCodes.CONFLICT)
      }

      // Check if job exists and is active
      const [jobs] = (await connection.execute("SELECT id, status FROM jobs WHERE id = ? AND status = 'active'", [
        applicationData.job_id,
      ])) as any[]

      if (jobs.length === 0) {
        throw createError("Job not found or not active", StatusCodes.NOT_FOUND)
      }

      const [result] = (await connection.execute(
        `INSERT INTO applications (job_id, user_id, cover_letter, resume_url) 
         VALUES (?, ?, ?, ?)`,
        [applicationData.job_id, userId, applicationData.cover_letter || null, applicationData.resume_url || null],
      )) as any[]

      const applicationId = result.insertId
      const createdApplication = await this.findById(applicationId)

      if (!createdApplication) {
        throw createError("Failed to create application", StatusCodes.INTERNAL_SERVER_ERROR)
      }

      logger.info(`Application created successfully: Job ${applicationData.job_id} by User ${userId}`)

      return createdApplication
    } catch (error) {
      logger.error("Error creating application:", error)
      throw error
    }
  }

  static async findById(id: number): Promise<Application | null> {
    const connection = getConnection()

    try {
      const [applications] = (await connection.execute("SELECT * FROM applications WHERE id = ?", [id])) as any[]

      return applications.length > 0 ? applications[0] : null
    } catch (error) {
      logger.error("Error finding application by ID:", error)
      throw error
    }
  }

  static async findByUserId(userId: number): Promise<ApplicationWithDetails[]> {
    const connection = getConnection()

    try {
      const [applications] = (await connection.execute(
        `SELECT a.*, j.title as job_title, u.name as posted_by_name 
         FROM applications a 
         JOIN jobs j ON a.job_id = j.id 
         JOIN users u ON j.posted_by = u.id 
         WHERE a.user_id = ? 
         ORDER BY a.applied_at DESC`,
        [userId],
      )) as any[]

      return applications
    } catch (error) {
      logger.error("Error finding applications by user ID:", error)
      throw error
    }
  }

  static async findByJobId(jobId: number): Promise<ApplicationWithDetails[]> {
    const connection = getConnection()

    try {
      const [applications] = (await connection.execute(
        `SELECT a.*, j.title as job_title, u.name as user_name, u.email as user_email 
         FROM applications a 
         JOIN jobs j ON a.job_id = j.id 
         JOIN users u ON a.user_id = u.id 
         WHERE a.job_id = ? 
         ORDER BY a.applied_at DESC`,
        [jobId],
      )) as any[]

      return applications
    } catch (error) {
      logger.error("Error finding applications by job ID:", error)
      throw error
    }
  }

  static async findByCollege(college: string): Promise<ApplicationWithDetails[]> {
    const connection = getConnection()

    try {
      const [applications] = (await connection.execute(
        `SELECT a.*, j.title as job_title, u.name as user_name, u.email as user_email 
         FROM applications a 
         JOIN jobs j ON a.job_id = j.id 
         JOIN users u ON a.user_id = u.id 
         WHERE j.college = ? 
         ORDER BY a.applied_at DESC`,
        [college],
      )) as any[]

      return applications
    } catch (error) {
      logger.error("Error finding applications by college:", error)
      throw error
    }
  }

  static async update(id: number, updateData: UpdateApplicationData, adminCollege?: string): Promise<Application> {
    const connection = getConnection()

    try {
      // If admin is updating, verify the application belongs to their college
      if (adminCollege) {
        const [applications] = (await connection.execute(
          `SELECT a.id FROM applications a 
           JOIN jobs j ON a.job_id = j.id 
           WHERE a.id = ? AND j.college = ?`,
          [id, adminCollege],
        )) as any[]

        if (applications.length === 0) {
          throw createError("Application not found or not from your college", StatusCodes.NOT_FOUND)
        }
      }

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
        `UPDATE applications SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        updateValues,
      )

      const updatedApplication = await this.findById(id)
      if (!updatedApplication) {
        throw createError("Failed to update application", StatusCodes.INTERNAL_SERVER_ERROR)
      }

      logger.info(`Application updated successfully: ID ${id}`)

      return updatedApplication
    } catch (error) {
      logger.error("Error updating application:", error)
      throw error
    }
  }

  static async delete(id: number, userId: number): Promise<void> {
    const connection = getConnection()

    try {
      // Verify application belongs to user
      const [applications] = (await connection.execute("SELECT id FROM applications WHERE id = ? AND user_id = ?", [
        id,
        userId,
      ])) as any[]

      if (applications.length === 0) {
        throw createError("Application not found or unauthorized", StatusCodes.NOT_FOUND)
      }

      await connection.execute("DELETE FROM applications WHERE id = ?", [id])

      logger.info(`Application deleted successfully: ID ${id}`)
    } catch (error) {
      logger.error("Error deleting application:", error)
      throw error
    }
  }

  static async getStats(college?: string): Promise<any> {
    const connection = getConnection()

    try {
      let query = `
        SELECT 
          COUNT(*) as total_applications,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_applications,
          SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_applications,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_applications
        FROM applications a
      `

      const params: any[] = []

      if (college) {
        query += " JOIN jobs j ON a.job_id = j.id WHERE j.college = ?"
        params.push(college)
      }

      const [stats] = (await connection.execute(query, params)) as any[]

      return stats[0]
    } catch (error) {
      logger.error("Error getting application stats:", error)
      throw error
    }
  }
}
