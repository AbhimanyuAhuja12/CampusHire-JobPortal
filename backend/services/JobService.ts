import { getConnection } from "../config/database"
import type { Job, CreateJobData, UpdateJobData, JobFilters } from "../models/Job"
import { createError } from "../middleware/errorHandler"
import { StatusCodes } from "../utils/httpStatusCodes"
import { logger } from "../utils/logger"

export class JobService {
  static async create(jobData: CreateJobData, postedBy: number): Promise<Job> {
    const connection = getConnection()

    try {
      const [result] = (await connection.execute(
        `INSERT INTO jobs (title, description, requirements, location, job_type, salary_range, deadline, posted_by, college) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          jobData.title,
          jobData.description,
          jobData.requirements || null,
          jobData.location,
          jobData.job_type,
          jobData.salary_range || null,
          jobData.deadline,
          postedBy,
          jobData.college,
        ],
      )) as any[]

      const jobId = result.insertId
      const createdJob = await this.findById(jobId)

      if (!createdJob) {
        throw createError("Failed to create job", StatusCodes.INTERNAL_SERVER_ERROR)
      }

      logger.info(`Job created successfully: ${createdJob.title}`)

      return createdJob
    } catch (error) {
      logger.error("Error creating job:", error)
      throw error
    }
  }

  static async findById(id: number): Promise<Job | null> {
    const connection = getConnection()

    try {
      const [jobs] = (await connection.execute("SELECT * FROM jobs WHERE id = ?", [id])) as any[]

      return jobs.length > 0 ? jobs[0] : null
    } catch (error) {
      logger.error("Error finding job by ID:", error)
      throw error
    }
  }

  static async findAll(
    filters: JobFilters = {},
  ): Promise<{ jobs: Job[]; total: number; page: number; totalPages: number }> {
    const connection = getConnection()

    try {
      const { search, location, job_type, college, status = "active", page = 1, limit = 10 } = filters

      const whereConditions: string[] = []
      const queryParams: any[] = []

      // Add filters
      if (status) {
        whereConditions.push("status = ?")
        queryParams.push(status)
      }

      if (search) {
        whereConditions.push("(title LIKE ? OR description LIKE ?)")
        queryParams.push(`%${search}%`, `%${search}%`)
      }

      if (location) {
        whereConditions.push("location LIKE ?")
        queryParams.push(`%${location}%`)
      }

      if (job_type) {
        whereConditions.push("job_type = ?")
        queryParams.push(job_type)
      }

      if (college) {
        whereConditions.push("college = ?")
        queryParams.push(college)
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM jobs ${whereClause}`
      const [countResult] = (await connection.execute(countQuery, queryParams)) as any[]
      const total = countResult[0].total

      // Calculate pagination
      const offset = (page - 1) * limit
      const totalPages = Math.ceil(total / limit)

      // Get jobs with pagination
      const jobsQuery = `
        SELECT j.*, u.name as posted_by_name 
        FROM jobs j 
        LEFT JOIN users u ON j.posted_by = u.id 
        ${whereClause} 
        ORDER BY j.created_at DESC 
        LIMIT ? OFFSET ?
      `

      const [jobs] = (await connection.execute(jobsQuery, [...queryParams, limit, offset])) as any[]

      return {
        jobs,
        total,
        page,
        totalPages,
      }
    } catch (error) {
      logger.error("Error finding jobs:", error)
      throw error
    }
  }

  static async update(id: number, updateData: UpdateJobData, userId: number): Promise<Job> {
    const connection = getConnection()

    try {
      // Verify job exists and user owns it
      const existingJob = await this.findById(id)
      if (!existingJob) {
        throw createError("Job not found", StatusCodes.NOT_FOUND)
      }

      if (existingJob.posted_by !== userId) {
        throw createError("Unauthorized to update this job", StatusCodes.FORBIDDEN)
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
        `UPDATE jobs SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        updateValues,
      )

      const updatedJob = await this.findById(id)
      if (!updatedJob) {
        throw createError("Failed to update job", StatusCodes.INTERNAL_SERVER_ERROR)
      }

      logger.info(`Job updated successfully: ${updatedJob.title}`)

      return updatedJob
    } catch (error) {
      logger.error("Error updating job:", error)
      throw error
    }
  }

  static async delete(id: number, userId: number): Promise<void> {
    const connection = getConnection()

    try {
      // Verify job exists and user owns it
      const existingJob = await this.findById(id)
      if (!existingJob) {
        throw createError("Job not found", StatusCodes.NOT_FOUND)
      }

      if (existingJob.posted_by !== userId) {
        throw createError("Unauthorized to delete this job", StatusCodes.FORBIDDEN)
      }

      await connection.execute("DELETE FROM jobs WHERE id = ?", [id])

      logger.info(`Job deleted successfully: ID ${id}`)
    } catch (error) {
      logger.error("Error deleting job:", error)
      throw error
    }
  }

  static async getJobsByUser(userId: number): Promise<Job[]> {
    const connection = getConnection()

    try {
      const [jobs] = (await connection.execute("SELECT * FROM jobs WHERE posted_by = ? ORDER BY created_at DESC", [
        userId,
      ])) as any[]

      return jobs
    } catch (error) {
      logger.error("Error getting jobs by user:", error)
      throw error
    }
  }

  static async getStats(college?: string): Promise<any> {
    const connection = getConnection()

    try {
      let query = `
        SELECT 
          COUNT(*) as total_jobs,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_jobs,
          SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_jobs,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_jobs
        FROM jobs
      `

      const params: any[] = []

      if (college) {
        query += " WHERE college = ?"
        params.push(college)
      }

      const [stats] = (await connection.execute(query, params)) as any[]

      return stats[0]
    } catch (error) {
      logger.error("Error getting job stats:", error)
      throw error
    }
  }
}
