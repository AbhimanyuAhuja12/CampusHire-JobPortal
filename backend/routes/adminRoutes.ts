import { Router } from "express"
import { AdminController } from "../controllers/AdminController"
import { authenticate, authorize } from "../middleware/auth"

const router = Router()

// All routes require admin authentication
router.use(authenticate)
router.use(authorize("admin"))

router.get("/pending-students", AdminController.getPendingStudents)
router.post("/approve-student/:id", AdminController.approveStudent)
router.get("/stats", AdminController.getStats)

export default router
