import { Router } from "express"
import { JobController } from "../controllers/JobController"
import { authenticate, authorize } from "../middleware/auth"

const router = Router()

// Public routes
router.get("/", JobController.getJobs)
router.get("/:id", JobController.getJobById)

// Protected routes
router.use(authenticate)

// Admin only routes
router.post("/", authorize("admin"), JobController.createJob)
router.put("/:id", authorize("admin"), JobController.updateJob)
router.delete("/:id", authorize("admin"), JobController.deleteJob)
router.get("/admin/my-jobs", authorize("admin"), JobController.getMyJobs)
router.get("/admin/stats", authorize("admin"), JobController.getJobStats)

export default router
