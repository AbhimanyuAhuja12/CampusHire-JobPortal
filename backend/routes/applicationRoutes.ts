import { Router } from "express"
import { ApplicationController } from "../controllers/ApplicationController"
import { authenticate, authorize } from "../middleware/auth"

const router = Router()

// All routes require authentication
router.use(authenticate)

// Student routes
router.post("/", authorize("student"), ApplicationController.createApplication)
router.get("/my-applications", authorize("student"), ApplicationController.getMyApplications)
router.delete("/:id", authorize("student"), ApplicationController.deleteApplication)

// Admin routes
router.get("/admin/all", authorize("admin"), ApplicationController.getAllApplications)
router.get("/job/:jobId", authorize("admin"), ApplicationController.getJobApplications)
router.put("/:id", authorize("admin"), ApplicationController.updateApplication)
router.get("/admin/stats", authorize("admin"), ApplicationController.getApplicationStats)

export default router
