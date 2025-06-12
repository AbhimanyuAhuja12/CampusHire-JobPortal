import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import rateLimit from "express-rate-limit"
import { config } from "./config/config"
import { connectDatabase } from "./config/database"
import { logger } from "./utils/logger"
import { globalErrorHandler } from "./middleware/errorHandler"
import { notFoundHandler } from "./middleware/notFoundHandler"

// Import routes
import authRoutes from "./routes/authRoutes"
import jobRoutes from "./routes/jobRoutes"
import adminRoutes from "./routes/adminRoutes"
import userRoutes from "./routes/userRoutes"
import applicationRoutes from "./routes/applicationRoutes"

class App {
  public app: express.Application

  constructor() {
    this.app = express()
    this.initializeDatabase()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandling()
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await connectDatabase()
      logger.info("Database connected successfully")
    } catch (error) {
      logger.error("Database connection failed:", error)
      process.exit(1)
    }
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet())

    // CORS configuration
    this.app.use(
      cors({
        origin: config.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    )

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests from this IP, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
    })
    this.app.use("/api/", limiter)

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }))
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }))

    // Compression middleware
    this.app.use(compression())

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path} - ${req.ip}`)
      next()
    })
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      })
    })

    // API routes
    this.app.use("/api/auth", authRoutes)
    this.app.use("/api/jobs", jobRoutes)
    this.app.use("/api/admin", adminRoutes)
    this.app.use("/api/users", userRoutes)
    this.app.use("/api/applications", applicationRoutes)
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler)

    // Global error handler
    this.app.use(globalErrorHandler)
  }

  public listen(): void {
    this.app.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT}`)
      logger.info(`Environment: ${config.NODE_ENV}`)
    })
  }
}

export default App
