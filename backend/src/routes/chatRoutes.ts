import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { getChatHistory, sendMessage } from "../controllers/chatController";

const router = Router();

router.post("/send", verifyToken, sendMessage)
router.get("/history/:userId", verifyToken, getChatHistory)

export default router;
