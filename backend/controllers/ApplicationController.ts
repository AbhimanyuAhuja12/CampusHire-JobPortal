import type { Response } from "express"
import { ApplicationService } from "../services/ApplicationService"
import { ApiResponse } from "../utils/httpStatusCodes"
import { asyncHandler } from "../middleware/errorHandler"
import type { AuthRequest } from "../middleware/auth"
import { logger } from "../utils/logger"

export class ApplicationController {
  static createApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { job_id, cover_letter, resume_url } = req.body

    // Validation
    if (!job_id) {
      return ApiResponse.badRequest(res, "Job ID is required")
    }

    const jobId = Number.parseInt(job_id)
    const userId = req.user.id

    // Validate jobId is a valid number
    if (isNaN(jobId)) {
      return ApiResponse.badRequest(res, "Invalid job ID")
    }

    // Pass parameters in correct order: userId, jobId, data
    const application = await ApplicationService.create(
      userId,
      jobId,
      {
        cover_letter,
        resume_url,
      }
    )

    logger.info(`New application created: Job ${jobId} by ${req.user.email}`)

    return ApiResponse.created(res, { application }, "Application submitted successfully")
  })

  static getMyApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const applications = await ApplicationService.findByUserId(req.user.id)

    return ApiResponse.success(res, { applications }, "Applications retrieved successfully")
  })

  static getJobApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const jobId = Number.parseInt(req.params.jobId)

    if (isNaN(jobId)) {
      return ApiResponse.badRequest(res, "Invalid job ID")
    }

    const applications = await ApplicationService.findByJobId(jobId)

    return ApiResponse.success(res, { applications }, "Job applications retrieved successfully")
  })

  static getAllApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
    // For admin users, get applications by college
    // For regular users, this might not be accessible - add role check if needed
    if (req.user.role !== 'admin') {
      return ApiResponse.forbidden(res, "Access denied. Admin role required.")
    }

    const applications = await ApplicationService.findByCollege(req.user.college)

    return ApiResponse.success(res, { applications }, "All applications retrieved successfully")
  })

  static updateApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
    const applicationId = Number.parseInt(req.params.id)

    if (isNaN(applicationId)) {
      return ApiResponse.badRequest(res, "Invalid application ID")
    }

    const { status, cover_letter, resume_url } = req.body

    const updateData: any = {}
    if (status) updateData.status = status
    if (cover_letter !== undefined) updateData.cover_letter = cover_letter
    if (resume_url !== undefined) updateData.resume_url = resume_url

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return ApiResponse.badRequest(res, "No fields provided for update")
    }

    const adminCollege = req.user.role === "admin" ? req.user.college : undefined
    const updatedApplication = await ApplicationService.update(applicationId, updateData, adminCollege)

    logger.info(`Application updated: ID ${applicationId} by ${req.user.email}`)

    return ApiResponse.success(res, { application: updatedApplication }, "Application updated successfully")
  })

  static updateApplicationStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const applicationId = Number.parseInt(req.params.id)
    const { status } = req.body

    if (isNaN(applicationId)) {
      return ApiResponse.badRequest(res, "Invalid application ID")
    }

    if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
      return ApiResponse.badRequest(res, "Valid status is required (pending, accepted, rejected)")
    }

    // Only admins can update application status
    if (req.user.role !== 'admin') {
      return ApiResponse.forbidden(res, "Access denied. Admin role required.")
    }

    const updatedApplication = await ApplicationService.updateStatus(applicationId, status, req.user.id)

    logger.info(`Application status updated: ID ${applicationId} to ${status} by ${req.user.email}`)

    return ApiResponse.success(res, { application: updatedApplication }, "Application status updated successfully")
  })

  static deleteApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
    const applicationId = Number.parseInt(req.params.id)

    if (isNaN(applicationId)) {
      return ApiResponse.badRequest(res, "Invalid application ID")
    }

    await ApplicationService.delete(applicationId, req.user.id)

    logger.info(`Application deleted: ID ${applicationId} by ${req.user.email}`)

    return ApiResponse.success(res, null, "Application deleted successfully")
  })

  static getApplicationStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Only admins can view statistics
    if (req.user.role !== 'admin') {
      return ApiResponse.forbidden(res, "Access denied. Admin role required.")
    }

    const college = req.user.college
    const stats = await ApplicationService.getStats(college)

    return ApiResponse.success(res, { stats }, "Application statistics retrieved successfully")
  })

  static getApplicationById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const applicationId = Number.parseInt(req.params.id)

    if (isNaN(applicationId)) {
      return ApiResponse.badRequest(res, "Invalid application ID")
    }
    
    return ApiResponse.badRequest(res, "Method not implemented. Use getMyApplications instead.")
  })

  // Additional helper method for getting applications by admin
  static getApplicationsByAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
    // Only admins can use this endpoint
    if (req.user.role !== 'admin') {
      return ApiResponse.forbidden(res, "Access denied. Admin role required.")
    }

    const applications = await ApplicationService.getByAdmin(req.user.id)

    return ApiResponse.success(res, { applications }, "Applications retrieved successfully")
  })
}