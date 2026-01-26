import express from "express";
import {
  getMessages,
  MessageSearch,
  updateMessage,
  deleteMessage,
} from "../controllers/messageController.ts";
import JWTMiddleware from "../middlewares/jwt-middleware.ts";

const router = express.Router();

router.get("/:id/messages", JWTMiddleware, getMessages);
router.get("/:id/messages/search", JWTMiddleware, MessageSearch);
router.put("/:id/messages/:messageId", JWTMiddleware, updateMessage);
router.delete("/:id/messages/:messageId", JWTMiddleware, deleteMessage);

export default router;
