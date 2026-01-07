import express from "express";
import {
  getMessages,
  MessageSearch,
} from "../controllers/messageController.ts";
import JWTMiddleware from "../middlewares/jwt-middleware.ts";

const router = express.Router();

router.get("/:id/messages", JWTMiddleware, getMessages);
router.get("/:id/messages/search", JWTMiddleware, MessageSearch);

export default router;