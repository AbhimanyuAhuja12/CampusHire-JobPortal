import type { Response } from "express"
import { UserService } from "../services/UserService"
import { ApiResponse } from "../utils/httpStatusCodes"
import { asyncHandler } from "../middleware/errorHandler"
import type { AuthRequest } from "../middleware/auth"

export class UserController {
  static getUserStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const college = req.user.role === "admin" ? req.user.college : undefined
    const stats = await UserService.getStats(college)

    return ApiResponse.success(res, { stats }, "User statistics retrieved successfully")
  })
}
