import type { Request, Response, NextFunction } from "express"
import { logger } from "../utils/logger"
import { ApiResponse, StatusCodes } from "../utils/httpStatusCodes"

export interface CustomError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const globalErrorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction): void => {
  // Log the error
  logger.error(`Error ${error.statusCode || 500}: ${error.message}`, {
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  })

  // Default error values
  let statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  let message = error.message || "Internal Server Error"

  // Handle specific error types
  if (error.name === "ValidationError") {
    statusCode = StatusCodes.BAD_REQUEST
    message = "Validation Error"
  }

  if (error.name === "JsonWebTokenError") {
    statusCode = StatusCodes.UNAUTHORIZED
    message = "Invalid token"
  }

  if (error.name === "TokenExpiredError") {
    statusCode = StatusCodes.UNAUTHORIZED
    message = "Token expired"
  }

  if (error.message.includes("duplicate key")) {
    statusCode = StatusCodes.CONFLICT
    message = "Resource already exists"
  }

  // Send error response
  ApiResponse.error(res, message, statusCode, process.env.NODE_ENV === "development" ? error.stack : null)
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export const createError = (message: string, statusCode: number): CustomError => {
  const error: CustomError = new Error(message)
  error.statusCode = statusCode
  error.isOperational = true
  return error
}
