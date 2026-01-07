import express from "express";
import {
  createChannel,
  deleteChannel,
  getChannelById,
  getChannels,
  joinChannel,
  updateChannel,
} from "../controllers/channelsController.ts";
import JWTMiddleware from "../middlewares/jwt-middleware.ts";

const router = express.Router();

router.get("/channels", JWTMiddleware, getChannels);
router.get("/channel/:id", JWTMiddleware, getChannelById);
router.get("/channels/:id/join", JWTMiddleware, joinChannel);
router.post("/create-channels", JWTMiddleware, createChannel);
router.put("/update-channels/:id", JWTMiddleware, updateChannel);
router.delete("/delete-channels/:id", JWTMiddleware, deleteChannel);

export default router;