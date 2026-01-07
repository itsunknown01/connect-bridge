import express from "express";
import {
  getMessages,
  MessageSearch,
} from "../controllers/messageController.ts";

const router = express.Router();

router.get("/:id/messages", getMessages);
router.get("/:id/messages/search", MessageSearch);

export default router;
