import express from "express";
import JWTMiddleware from "../middlewares/jwt-middleware.ts";
import {
  createChannelKnowledge,
  deleteChannelKnowledge,
  fetchChannelKnowledge,
} from "../controllers/knowledgeController.ts";

const router = express.Router();

router.get("/:id/knowledge", JWTMiddleware, fetchChannelKnowledge);
router.post("/:id/knowledge", JWTMiddleware, createChannelKnowledge);
router.delete(
  "/:id/knowledge/:knowledgeId",
  JWTMiddleware,
  deleteChannelKnowledge
);

export default router;
