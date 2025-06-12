import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config/config"
import { ApiResponse } from "../utils/httpStatusCodes"
import { UserService } from "../services/UserService"
import { asyncHandler } from "./errorHandler"

export interface AuthRequest extends Request {
  user?: any
}

export const authenticate = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return ApiResponse.unauthorized(res, "Access token is required")
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as any
    const user = await UserService.findById(decoded.id)

    if (!user) {
      return ApiResponse.unauthorized(res, "Invalid token")
    }

    req.user = user
    next()
  } catch (error) {
    return ApiResponse.unauthorized(res, "Invalid token")
  }
})

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, "Authentication required")
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, "Insufficient permissions")
    }

    next()
  }
}

export const requireApproval = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, "Authentication required")
  }

  if (req.user.role === "student" && !req.user.is_approved) {
    return ApiResponse.forbidden(res, "Account pending approval from college admin")
  }

  next()
}
