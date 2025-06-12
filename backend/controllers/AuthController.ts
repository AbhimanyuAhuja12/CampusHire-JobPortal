import type { Request, Response } from "express"
import { UserService } from "../services/UserService"
import { ApiResponse } from "../utils/httpStatusCodes"
import { asyncHandler } from "../middleware/errorHandler"
import { logger } from "../utils/logger"

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role, college } = req.body

    // Validation
    if (!name || !email || !password || !role || !college) {
      return ApiResponse.badRequest(res, "All fields are required")
    }

    if (!["student", "admin"].includes(role)) {
      return ApiResponse.badRequest(res, "Invalid role")
    }

    if (password.length < 6) {
      return ApiResponse.badRequest(res, "Password must be at least 6 characters long")
    }

    const result = await UserService.create({ name, email, password, role, college })

    logger.info(`New user registered: ${email} as ${role}`)

    return ApiResponse.created(res, result, "User registered successfully")
  })

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, role } = req.body

    // Validation
    if (!email || !password || !role) {
      return ApiResponse.badRequest(res, "Email, password, and role are required")
    }

    if (!["student", "admin"].includes(role)) {
      return ApiResponse.badRequest(res, "Invalid role")
    }

    const result = await UserService.login({ email, password, role })

    logger.info(`User logged in: ${email} as ${role}`)

    return ApiResponse.success(res, result, "Login successful")
  })

  static getProfile = asyncHandler(async (req: any, res: Response) => {
    const user = await UserService.findById(req.user.id)

    if (!user) {
      return ApiResponse.notFound(res, "User not found")
    }

    return ApiResponse.success(res, { user }, "Profile retrieved successfully")
  })

  static updateProfile = asyncHandler(async (req: any, res: Response) => {
    const { name, email, profile_picture } = req.body

    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (profile_picture) updateData.profile_picture = profile_picture

    const updatedUser = await UserService.update(req.user.id, updateData)

    logger.info(`User profile updated: ${updatedUser.email}`)

    return ApiResponse.success(res, { user: updatedUser }, "Profile updated successfully")
  })
}
