import { Router } from "express"
import { UserController } from "../controllers/UserController"
import { authenticate } from "../middleware/auth"

const router = Router()

// All routes require authentication
router.use(authenticate)

router.get("/stats", UserController.getUserStats)

export default router
