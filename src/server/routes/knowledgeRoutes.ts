import express from "express"
import JWTMiddleware from "../middlewares/jwt-middleware.ts";
import { fetchChannelKnowledge } from "../controllers/knowledgeController.ts";

const router = express.Router();

router.get('/:id/knowledge', JWTMiddleware, fetchChannelKnowledge)
router.post('/:id/knowledge', JWTMiddleware, )
router.delete('/:id/knowledge/:knowledgeId', JWTMiddleware, )

export default router