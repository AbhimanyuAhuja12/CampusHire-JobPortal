import { getConnection } from "../config/database"
import { createError } from "../middleware/errorHandler"
import { StatusCodes } from "../utils/httpStatusCodes"
import { logger } from "../utils/logger"

export interface Application {
  id: number
  user_id: number
  job_id: number
  cover_letter?: string
  resume_url?: string
  status: "pending" | "accepted" | "rejected"
  applied_at: Date
  updated_at: Date
}

export interface ApplicationWithDetails extends Application {
  user_name: string
  user_email: string
  job_title: string
}

export class ApplicationService {
  static async create(
    userId: number,
    jobId: number,
    data: { cover_letter?: string; resume_url?: string },
  ): Promise<Application> {
    const connection = getConnection()

    try {
      // Check if job exists
      const [jobs] = (await connection.execute("SELECT * FROM jobs WHERE id = ?", [jobId])) as any[]
      if (jobs.length === 0) {
        throw createError("Job not found", StatusCodes.NOT_FOUND)
      }

      // Check if user has already applied
      const [existingApplications] = (await connection.execute(
        "SELECT * FROM applications WHERE user_id = ? AND job_id = ?",
        [userId, jobId],
      )) as any[]

      if (existingApplications.length > 0) {
        throw createError("You have already applied for this job", StatusCodes.BAD_REQUEST)
      }

      const [result] = (await connection.execute(
        `INSERT INTO applications (user_id, job_id, cover_letter, resume_url, status) 
         VALUES (?, ?, ?, ?, 'pending')`,
        [userId, jobId, data.cover_letter || null, data.resume_url || null],
      )) as any[]

      const applicationId = result.insertId
      const [applications] = (await connection.execute("SELECT * FROM applications WHERE id = ?", [
        applicationId,
      ])) as any[]

      logger.info(`Application created: User ${userId} applied for job ${jobId}`)

      return applications[0]
    } catch (error) {
      logger.error("Error creating application:", error)
      throw error
    }
  }

  // Alias methods to match controller expectations
  static async findByUserId(userId: number): Promise<ApplicationWithDetails[]> {
    return this.getByUser(userId)
  }

  static async findByJobId(jobId: number): Promise<ApplicationWithDetails[]> {
    return this.getByJob(jobId)
  }

  static async findByCollege(college: string): Promise<ApplicationWithDetails[]> {
    const connection = getConnection()

    try {
      // Get all applications for jobs in the specified college
      const [applications] = (await connection.execute(
        `SELECT a.*, u.name as user_name, u.email as user_email, j.title as job_title 
         FROM applications a 
         JOIN users u ON a.user_id = u.id 
         JOIN jobs j ON a.job_id = j.id 
         WHERE j.college = ?
         ORDER BY a.applied_at DESC`,
        [college],
      )) as any[]

      return applications
    } catch (error) {
      logger.error("Error getting applications by college:", error)
      throw error
    }
  }

  static async getByUser(userId: number): Promise<ApplicationWithDetails[]> {
    const connection = getConnection()

    try {
      const [applications] = (await connection.execute(
        `SELECT a.*, j.title as job_title 
         FROM applications a 
         JOIN jobs j ON a.job_id = j.id 
         WHERE a.user_id = ? 
         ORDER BY a.applied_at DESC`,
        [userId],
      )) as any[]

      return applications
    } catch (error) {
      logger.error("Error getting applications by user:", error)
      throw error
    }
  }

  static async getByJob(jobId: number): Promise<ApplicationWithDetails[]> {
    const connection = getConnection()

    try {
      const [applications] = (await connection.execute(
        `SELECT a.*, u.name as user_name, u.email as user_email, j.title as job_title 
         FROM applications a 
         JOIN users u ON a.user_id = u.id 
         JOIN jobs j ON a.job_id = j.id 
         WHERE a.job_id = ? 
         ORDER BY a.applied_at DESC`,
        [jobId],
      )) as any[]

      return applications
    } catch (error) {
      logger.error("Error getting applications by job:", error)
      throw error
    }
  }

  static async getByAdmin(adminId: number): Promise<ApplicationWithDetails[]> {
    const connection = getConnection()

    try {
      // Get admin's college
      const [admins] = (await connection.execute("SELECT college FROM users WHERE id = ? AND role = 'admin'", [
        adminId,
      ])) as any[]

      if (admins.length === 0) {
        throw createError("Admin not found", StatusCodes.NOT_FOUND)
      }

      const adminCollege = admins[0].college

      // Get all applications for jobs posted by this admin or for jobs in the same college
      const [applications] = (await connection.execute(
        `SELECT a.*, u.name as user_name, u.email as user_email, j.title as job_title 
         FROM applications a 
         JOIN users u ON a.user_id = u.id 
         JOIN jobs j ON a.job_id = j.id 
         WHERE j.college = ? OR j.posted_by = ?
         ORDER BY a.applied_at DESC`,
        [adminCollege, adminId],
      )) as any[]

      return applications
    } catch (error) {
      logger.error("Error getting applications by admin:", error)
      throw error
    }
  }

  static async update(
    applicationId: number,
    updateData: { status?: string; cover_letter?: string; resume_url?: string },
    adminCollege?: string
  ): Promise<Application> {
    const connection = getConnection()

    try {
      // Check if application exists
      const [applications] = (await connection.execute(
        `SELECT a.*, j.college, j.posted_by 
         FROM applications a 
         JOIN jobs j ON a.job_id = j.id 
         WHERE a.id = ?`,
        [applicationId],
      )) as any[]

      if (applications.length === 0) {
        throw createError("Application not found", StatusCodes.NOT_FOUND)
      }

      const application = applications[0]

      // If adminCollege is provided, verify permission
      if (adminCollege && application.college !== adminCollege) {
        throw createError("Unauthorized to update this application", StatusCodes.FORBIDDEN)
      }

      // Build update query dynamically
      const updateFields = []
      const updateValues = []

      if (updateData.status !== undefined) {
        updateFields.push("status = ?")
        updateValues.push(updateData.status)
      }
      if (updateData.cover_letter !== undefined) {
        updateFields.push("cover_letter = ?")
        updateValues.push(updateData.cover_letter)
      }
      if (updateData.resume_url !== undefined) {
        updateFields.push("resume_url = ?")
        updateValues.push(updateData.resume_url)
      }

      if (updateFields.length === 0) {
        throw createError("No fields to update", StatusCodes.BAD_REQUEST)
      }

      updateFields.push("updated_at = CURRENT_TIMESTAMP")
      updateValues.push(applicationId)

      const updateQuery = `UPDATE applications SET ${updateFields.join(", ")} WHERE id = ?`
      
      await connection.execute(updateQuery, updateValues)

      // Get updated application
      const [updatedApplications] = (await connection.execute("SELECT * FROM applications WHERE id = ?", [
        applicationId,
      ])) as any[]

      logger.info(`Application ${applicationId} updated`)

      return updatedApplications[0]
    } catch (error) {
      logger.error("Error updating application:", error)
      throw error
    }
  }

  static async delete(applicationId: number, userId: number): Promise<void> {
    const connection = getConnection()

    try {
      // Check if application exists and belongs to user
      const [applications] = (await connection.execute(
        "SELECT * FROM applications WHERE id = ? AND user_id = ?",
        [applicationId, userId],
      )) as any[]

      if (applications.length === 0) {
        throw createError("Application not found or unauthorized", StatusCodes.NOT_FOUND)
      }

      await connection.execute("DELETE FROM applications WHERE id = ? AND user_id = ?", [
        applicationId,
        userId,
      ])

      logger.info(`Application ${applicationId} deleted by user ${userId}`)
    } catch (error) {
      logger.error("Error deleting application:", error)
      throw error
    }
  }

  static async getStats(college?: string): Promise<{
    total: number
    pending: number
    accepted: number
    rejected: number
  }> {
    const connection = getConnection()

    try {
      let whereClause = ""
      const params: any[] = []

      if (college) {
        whereClause = "WHERE j.college = ?"
        params.push(college)
      }

      // Get total count
      const [totalResult] = (await connection.execute(
        `SELECT COUNT(*) as count 
         FROM applications a 
         JOIN jobs j ON a.job_id = j.id 
         ${whereClause}`,
        params,
      )) as any[]

      // Get status counts
      const [statusCounts] = (await connection.execute(
        `SELECT status, COUNT(*) as count 
         FROM applications a 
         JOIN jobs j ON a.job_id = j.id 
         ${whereClause}
         GROUP BY status`,
        params,
      )) as any[]

      const stats = {
        total: totalResult[0].count,
        pending: 0,
        accepted: 0,
        rejected: 0,
      }

      // Map status counts
      statusCounts.forEach((row: any) => {
        if (row.status === "pending") stats.pending = row.count
        if (row.status === "accepted") stats.accepted = row.count
        if (row.status === "rejected") stats.rejected = row.count
      })

      return stats
    } catch (error) {
      logger.error("Error getting application stats:", error)
      throw error
    }
  }

  static async updateStatus(
    applicationId: number,
    status: "pending" | "accepted" | "rejected",
    adminId: number,
  ): Promise<Application> {
    const connection = getConnection()

    try {
      // Verify application exists and admin has permission
      const [applications] = (await connection.execute(
        `SELECT a.*, j.posted_by, j.college 
         FROM applications a 
         JOIN jobs j ON a.job_id = j.id 
         WHERE a.id = ?`,
        [applicationId],
      )) as any[]

      if (applications.length === 0) {
        throw createError("Application not found", StatusCodes.NOT_FOUND)
      }

      const application = applications[0]

      // Get admin's college
      const [admins] = (await connection.execute("SELECT college FROM users WHERE id = ? AND role = 'admin'", [
        adminId,
      ])) as any[]

      if (admins.length === 0) {
        throw createError("Admin not found", StatusCodes.NOT_FOUND)
      }

      const adminCollege = admins[0].college

      // Check if admin has permission (either posted the job or from the same college)
      if (application.posted_by !== adminId && application.college !== adminCollege) {
        throw createError("Unauthorized to update this application", StatusCodes.FORBIDDEN)
      }

      await connection.execute("UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
        status,
        applicationId,
      ])

      const [updatedApplications] = (await connection.execute("SELECT * FROM applications WHERE id = ?", [
        applicationId,
      ])) as any[]

      logger.info(`Application ${applicationId} status updated to ${status} by admin ${adminId}`)

      return updatedApplications[0]
    } catch (error) {
      logger.error("Error updating application status:", error)
      throw error
    }
  }
}