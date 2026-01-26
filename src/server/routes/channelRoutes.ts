import express from "express";
import {
  createChannel,
  deleteChannel,
  fetchChannelMembers,
  getChannelById,
  getChannels,
  joinChannel,
  updateChannel,
  inviteMember,
  leaveChannel,
  removeMember,
} from "../controllers/channelsController.ts";
import JWTMiddleware from "../middlewares/jwt-middleware.ts";

const router = express.Router();

router.get("/channels", JWTMiddleware, getChannels);
router.get("/channel/:id", JWTMiddleware, getChannelById);
router.get("/channels/:id/join", JWTMiddleware, joinChannel);
router.get("/channels/:id/members", JWTMiddleware, fetchChannelMembers);
router.post("/channels/:id/invite", JWTMiddleware, inviteMember);
router.delete("/channels/:id/leave", JWTMiddleware, leaveChannel);
router.delete("/channels/:id/members/:userId", JWTMiddleware, removeMember);
router.post("/create-channels", JWTMiddleware, createChannel);
router.put("/update-channels/:id", JWTMiddleware, updateChannel);
router.delete("/delete-channels/:id", JWTMiddleware, deleteChannel);

export default router;
