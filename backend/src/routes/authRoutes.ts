import { Router } from "express"

import { registerUser, loginUser, me } from "../controllers/authController"

const router = Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/me", me)

export default router;