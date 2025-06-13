import type { Request, Response, NextFunction } from "express"
import { JobService } from "../services/JobService"
import { createError } from "../middleware/errorHandler"
import { StatusCodes } from "../utils/httpStatusCodes"
import { logger } from "../utils/logger"

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: "student" | "admin";
//   college: string;
//   isApproved?: boolean;
// }
export class JobController {
  static async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;

      const jobData = req.body

      if (!userId) {
        return next(createError("Unauthorized", StatusCodes.UNAUTHORIZED))
      }

      // Ensure college is set from the admin's college
      jobData.college = (req as any).user?.college;


      const job = await JobService.create(jobData, userId)

      logger.info(`Job created: ${job.title} by user ${userId}`)

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Job created successfully",
        data: { job },
      })
    } catch (error) {
      next(error)
    }
  }

  static async getJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        search: req.query.search as string,
        location: req.query.location as string,
        job_type: req.query.job_type as string,
        college: req.query.college as string,
        status: req.query.status as string,
        page: req.query.page ? Number.parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? Number.parseInt(req.query.limit as string) : 10,
      }

      // Log the filters for debugging
      logger.info(`Getting jobs with filters: ${JSON.stringify(filters)}`)

      const result = await JobService.findAll(filters)

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Jobs retrieved successfully",
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  static async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = Number.parseInt(req.params.id)
      const job = await JobService.findById(jobId)

      if (!job) {
        return next(createError("Job not found", StatusCodes.NOT_FOUND))
      }

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Job retrieved successfully",
        data: { job },
      })
    } catch (error) {
      next(error)
    }
  }

  static async updateJob(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = Number.parseInt(req.params.id)
      const userId = (req as any).user?.id;

      if (!userId) {
        return next(createError("Unauthorized", StatusCodes.UNAUTHORIZED))
      }

      const job = await JobService.update(jobId, req.body, userId)

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Job updated successfully",
        data: { job },
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = Number.parseInt(req.params.id)
      const userId = (req as any).user?.id;

      if (!userId) {
        return next(createError("Unauthorized", StatusCodes.UNAUTHORIZED))
      }

      await JobService.delete(jobId, userId)

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Job deleted successfully",
      })
    } catch (error) {
      next(error)
    }
  }

  static async getMyJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return next(createError("Unauthorized", StatusCodes.UNAUTHORIZED))
      }

      const jobs = await JobService.getJobsByUser(userId)

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Jobs retrieved successfully",
        data: { jobs },
      })
    } catch (error) {
      next(error)
    }
  }

  static async getJobStats(req: Request, res: Response, next: NextFunction) {
    try {
      const college = (req as any).user?.role === "admin" ? (req as any).user.college : undefined
      const stats = await JobService.getStats(college)

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Job stats retrieved successfully",
        data: { stats },
      })
    } catch (error) {
      next(error)
    }
  }
}
