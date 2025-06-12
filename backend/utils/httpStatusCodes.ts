import { StatusCodes, ReasonPhrases } from "http-status-codes"

export { StatusCodes, ReasonPhrases }

// Custom response utility
export class ApiResponse {
  static success(res: any, data: any = null, message = "Success", statusCode: number = StatusCodes.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    })
  }

  static error(
    res: any,
    message = "Internal Server Error",
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    errors: any = null,
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    })
  }

  static created(res: any, data: any = null, message = "Created successfully") {
    return this.success(res, data, message, StatusCodes.CREATED)
  }

  static badRequest(res: any, message = "Bad Request", errors: any = null) {
    return this.error(res, message, StatusCodes.BAD_REQUEST, errors)
  }

  static unauthorized(res: any, message = "Unauthorized") {
    return this.error(res, message, StatusCodes.UNAUTHORIZED)
  }

  static forbidden(res: any, message = "Forbidden") {
    return this.error(res, message, StatusCodes.FORBIDDEN)
  }

  static notFound(res: any, message = "Resource not found") {
    return this.error(res, message, StatusCodes.NOT_FOUND)
  }

  static conflict(res: any, message = "Conflict") {
    return this.error(res, message, StatusCodes.CONFLICT)
  }

  static validationError(res: any, errors: any, message = "Validation failed") {
    return this.error(res, message, StatusCodes.UNPROCESSABLE_ENTITY, errors)
  }
}
