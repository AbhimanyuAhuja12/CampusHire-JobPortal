import type { Response } from "express"
import { UserService } from "../services/UserService"
import { ApiResponse } from "../utils/httpStatusCodes"
import { asyncHandler } from "../middleware/errorHandler"
import type { AuthRequest } from "../middleware/auth"
import { logger } from "../utils/logger"

export class AdminController {
  static getPendingStudents = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pendingStudents = await UserService.getPendingStudents(req.user.college)

    return ApiResponse.success(res, { students: pendingStudents }, "Pending students retrieved successfully")
  })

  static approveStudent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const studentId = Number.parseInt(req.params.id)

    if (isNaN(studentId)) {
      return ApiResponse.badRequest(res, "Invalid student ID")
    }

    await UserService.approveStudent(studentId, req.user.college)

    logger.info(`Student approved: ID ${studentId} by admin ${req.user.email}`)

    return ApiResponse.success(res, null, "Student approved successfully")
  })

  static getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const stats = await UserService.getStats(req.user.college)

    return ApiResponse.success(res, { stats }, "Statistics retrieved successfully")
  })
}
