import type { Request, Response } from "express"
import { ApiResponse } from "../utils/httpStatusCodes"

export const notFoundHandler = (req: Request, res: Response): void => {
  ApiResponse.notFound(res, `Route ${req.originalUrl} not found`)
}
