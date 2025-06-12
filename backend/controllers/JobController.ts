import type { Request, Response } from "express"
import { JobService } from "../services/JobService"
import { ApiResponse } from "../utils/httpStatusCodes"
import { asyncHandler } from "../middleware/errorHandler"
import type { AuthRequest } from "../middleware/auth"
import { logger } from "../utils/logger"

export class JobController {
  static createJob = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, description, requirements, location, job_type, salary_range, deadline } = req.body

    // Validation
    if (!title || !description || !location || !job_type || !deadline) {
      return ApiResponse.badRequest(res, "Title, description, location, job type, and deadline are required")
    }

    const jobData = {
      title,
      description,
      requirements,
      location,
      job_type,
      salary_range,
      deadline,
      college: req.user.college,
    }

    const job = await JobService.create(jobData, req.user.id)

    logger.info(`New job created: ${job.title} by ${req.user.email}`)

    return ApiResponse.created(res, { job }, "Job created successfully")
  })

  static getJobs = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      search: req.query.search as string,
      location: req.query.location as string,
      job_type: req.query.job_type as string,
      college: req.query.college as string,
      status: req.query.status as string,
      page: Number.parseInt(req.query.page as string) || 1,
      limit: Number.parseInt(req.query.limit as string) || 10,
    }

    const result = await JobService.findAll(filters)

    return ApiResponse.success(res, result, "Jobs retrieved successfully")
  })

  static getJobById = asyncHandler(async (req: Request, res: Response) => {
    const jobId = Number.parseInt(req.params.id)

    if (isNaN(jobId)) {
      return ApiResponse.badRequest(res, "Invalid job ID")
    }

    const job = await JobService.findById(jobId)

    if (!job) {
      return ApiResponse.notFound(res, "Job not found")
    }

    return ApiResponse.success(res, { job }, "Job retrieved successfully")
  })

  static updateJob = asyncHandler(async (req: AuthRequest, res: Response) => {
    const jobId = Number.parseInt(req.params.id)

    if (isNaN(jobId)) {
      return ApiResponse.badRequest(res, "Invalid job ID")
    }

    const { title, description, requirements, location, job_type, salary_range, deadline, status } = req.body

    const updateData: any = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (requirements !== undefined) updateData.requirements = requirements
    if (location) updateData.location = location
    if (job_type) updateData.job_type = job_type
    if (salary_range !== undefined) updateData.salary_range = salary_range
    if (deadline) updateData.deadline = deadline
    if (status) updateData.status = status

    const updatedJob = await JobService.update(jobId, updateData, req.user.id)

    logger.info(`Job updated: ${updatedJob.title} by ${req.user.email}`)

    return ApiResponse.success(res, { job: updatedJob }, "Job updated successfully")
  })

  static deleteJob = asyncHandler(async (req: AuthRequest, res: Response) => {
    const jobId = Number.parseInt(req.params.id)

    if (isNaN(jobId)) {
      return ApiResponse.badRequest(res, "Invalid job ID")
    }

    await JobService.delete(jobId, req.user.id)

    logger.info(`Job deleted: ID ${jobId} by ${req.user.email}`)

    return ApiResponse.success(res, null, "Job deleted successfully")
  })

  static getMyJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
    const jobs = await JobService.getJobsByUser(req.user.id)

    return ApiResponse.success(res, { jobs }, "Your jobs retrieved successfully")
  })

  static getJobStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const college = req.user.role === "admin" ? req.user.college : undefined
    const stats = await JobService.getStats(college)

    return ApiResponse.success(res, { stats }, "Job statistics retrieved successfully")
  })
}
