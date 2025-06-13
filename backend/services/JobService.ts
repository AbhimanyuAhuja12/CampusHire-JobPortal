import { getConnection } from "../config/database";
import type { Job, CreateJobData, UpdateJobData, JobFilters } from "../models/Job";
import { createError } from "../middleware/errorHandler";
import { StatusCodes } from "../utils/httpStatusCodes";
import { logger } from "../utils/logger";
import { OkPacket, RowDataPacket, ResultSetHeader } from "mysql2"; 

export class JobService {
  static async create(jobData: CreateJobData, postedBy: number): Promise<Job> {
    const connection = getConnection();

    try {
      const [result] = (await connection.execute(
        `INSERT INTO jobs (title, description, requirements, location, job_type, salary_range, deadline, posted_by, college, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
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
      )) as ResultSetHeader[]; // Corrected type assertion

      const jobId = result.insertId;
      const createdJob = await this.findById(jobId);

      if (!createdJob) {
        throw createError("Failed to create job", StatusCodes.INTERNAL_SERVER_ERROR);
      }

      logger.info(`Job created successfully: ${createdJob.title} for college ${jobData.college}`);

      return createdJob;
    } catch (error: unknown) { // Explicitly type error as unknown
      logger.error("Error creating job:", error);
      logger.error("Error details:", { filters: jobData, stack: (error as Error).stack }); // Safely access stack
      throw error;
    }
  }

  static async findById(id: number): Promise<Job | null> {
    const connection = getConnection();

    try {
      // Use RowDataPacket for SELECT queries
      const [jobs] = (await connection.execute(
        `SELECT j.*, u.name as posted_by_name 
         FROM jobs j 
         LEFT JOIN users u ON j.posted_by = u.id 
         WHERE j.id = ?`,
        [id],
      )) as RowDataPacket[]; // Corrected type assertion

      return jobs.length > 0 ? (jobs[0] as Job) : null; // Cast to Job type for clarity
    } catch (error: unknown) { // Explicitly type error as unknown
      logger.error("Error finding job by ID:", error);
      logger.error("Error details:", { id, stack: (error as Error).stack }); // Safely access stack
      throw error;
    }
  }

  static async findAll(
    filters: JobFilters = {},
  ): Promise<{ jobs: Job[]; total: number; page: number; totalPages: number }> {
    const connection = getConnection();

    try {
      const { search, location, job_type, college, status = "active", page = 1, limit = 10 } = filters;

      const whereConditions: string[] = [];
      const queryParams: any[] = [];

      if (status) {
        whereConditions.push("j.status = ?");
        queryParams.push(status);
      }

      if (search) {
        whereConditions.push("(j.title LIKE ? OR j.description LIKE ?)");
        queryParams.push(`%${search}%`, `%${search}%`);
      }

      if (location) {
        whereConditions.push("j.location LIKE ?");
        queryParams.push(`%${location}%`);
      }

      if (job_type) {
        whereConditions.push("j.job_type = ?");
        queryParams.push(job_type);
      }

      if (college) {
        whereConditions.push("j.college = ?");
        queryParams.push(college);
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

      logger.info(`Job query filters: ${JSON.stringify(filters)}`);
      logger.info(`Where conditions: ${whereConditions.join(" AND ")}`);
      logger.info(`Query params: ${queryParams.map(p => (typeof p === 'string' ? `'${p}'` : p)).join(", ")}`); // Improved logging for params

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM jobs j ${whereClause}`;
      const [countResult] = (await connection.execute(countQuery, queryParams)) as RowDataPacket[]; // Use RowDataPacket
      const total = countResult[0].total;

      const offset = (page - 1) * limit;
      const totalPages = Math.ceil(total / limit);

      const numericLimit = Number(limit);
      const numericOffset = Number(offset);

      const jobsQuery = `
        SELECT j.*, u.name as posted_by_name 
        FROM jobs j 
        LEFT JOIN users u ON j.posted_by = u.id 
        ${whereClause} 
        ORDER BY j.created_at DESC 
        LIMIT ? OFFSET ?
      `;

      const jobsQueryParams = [...queryParams, numericLimit, numericOffset];

      logger.info(`Jobs query: ${jobsQuery}`);
      logger.info(`Jobs query params: ${jobsQueryParams.map(p => (typeof p === 'string' ? `'${p}'` : p)).join(", ")}`); // Improved logging for params

      const [jobs] = (await connection.execute(jobsQuery, jobsQueryParams)) as RowDataPacket[]; // Use RowDataPacket

      return {
        jobs: jobs as Job[], 
        total,
        page,
        totalPages,
      };
    } catch (error: unknown) { // Explicitly type error as unknown
      logger.error("Error finding jobs:", error);
      logger.error("Error details:", { filters, stack: (error as Error).stack }); // Safely access stack
      throw error;
    }
  }

  static async update(id: number, updateData: UpdateJobData, userId: number): Promise<Job> {
    const connection = getConnection();

    try {
      const existingJob = await this.findById(id);
      if (!existingJob) {
        throw createError("Job not found", StatusCodes.NOT_FOUND);
      }

      if (existingJob.posted_by !== userId) {
        throw createError("Unauthorized to update this job", StatusCodes.FORBIDDEN);
      }

      const updateFields: string[] = [];
      const updateValues: any[] = [];

      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      });

      if (updateFields.length === 0) {
        throw createError("No fields to update", StatusCodes.BAD_REQUEST);
      }

      updateValues.push(id);

      // Use ResultSetHeader for UPDATE operations
      await connection.execute(
        `UPDATE jobs SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        updateValues,
      ) as ResultSetHeader[]; // Corrected type assertion

      const updatedJob = await this.findById(id);
      if (!updatedJob) {
        throw createError("Failed to update job", StatusCodes.INTERNAL_SERVER_ERROR);
      }

      logger.info(`Job updated successfully: ${updatedJob.title}`);

      return updatedJob;
    } catch (error: unknown) { // Explicitly type error as unknown
      logger.error("Error updating job:", error);
      logger.error("Error details:", { id, updateData, stack: (error as Error).stack }); // Safely access stack
      throw error;
    }
  }

  static async delete(id: number, userId: number): Promise<void> {
    const connection = getConnection();

    try {
      const existingJob = await this.findById(id);
      if (!existingJob) {
        throw createError("Job not found", StatusCodes.NOT_FOUND);
      }

      if (existingJob.posted_by !== userId) {
        throw createError("Unauthorized to delete this job", StatusCodes.FORBIDDEN);
      }

      // Use ResultSetHeader for DELETE operations
      await connection.execute("DELETE FROM jobs WHERE id = ?", [id]) as ResultSetHeader[]; // Corrected type assertion

      logger.info(`Job deleted successfully: ID ${id}`);
    } catch (error: unknown) { // Explicitly type error as unknown
      logger.error("Error deleting job:", error);
      logger.error("Error details:", { id, stack: (error as Error).stack }); // Safely access stack
      throw error;
    }
  }

  static async getJobsByUser(userId: number): Promise<Job[]> {
    const connection = getConnection();

    try {
      // Use RowDataPacket for SELECT queries
      const [jobs] = (await connection.execute(
        `SELECT j.*, u.name as posted_by_name 
         FROM jobs j 
         LEFT JOIN users u ON j.posted_by = u.id 
         WHERE j.posted_by = ? 
         ORDER BY j.created_at DESC`,
        [userId],
      )) as RowDataPacket[]; // Corrected type assertion

      return jobs as Job[]; // Cast to Job[] type
    } catch (error: unknown) { // Explicitly type error as unknown
      logger.error("Error getting jobs by user:", error);
      logger.error("Error details:", { userId, stack: (error as Error).stack }); // Safely access stack
      throw error;
    }
  }

  static async getStats(college?: string): Promise<any> {
    const connection = getConnection();

    try {
      let query = `
        SELECT 
          COUNT(*) as total_jobs,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_jobs,
          SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_jobs,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_jobs
        FROM jobs
      `;

      const params: any[] = [];

      if (college) {
        query += " WHERE college = ?";
        params.push(college);
      }

      // Use RowDataPacket for SELECT queries
      const [stats] = (await connection.execute(query, params)) as RowDataPacket[];

      return stats[0];
    } catch (error: unknown) { 
      logger.error("Error getting job stats:", error);
      logger.error("Error details:", { college, stack: (error as Error).stack }); 
      throw error;
    }
  }
}