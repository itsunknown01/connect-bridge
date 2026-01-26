import http from "http";
import express from "express";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { and, eq, ne } from "drizzle-orm";
import { db } from "./db.ts";
import { channelMembers, messages, users } from "./schema.ts";

import dotenv from "dotenv";
import { createAdapter } from "@socket.io/redis-adapter";
import { redis, pubClient, subClient } from "./redis.ts";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.adapter(createAdapter(pubClient, subClient));

io.use(async (socket, next) => {
  const cookies = socket.request.headers.cookie;
  if (!cookies) return next(new Error("Unauthorized"));

  const token = cookies
    .split("; ")
    .find((c) => c.startsWith("refresh="))
    ?.split("=")[1];

  if (!token) return next(new Error("Unauthorized"));

  try {
    const payload = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as jwt.JwtPayload;

    if (!payload) return next(new Error("Not authenticated"));

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, payload.email),
    });

    if (!existingUser) return next(new Error("User does not exist"));
    socket.user = {
      sub: String(existingUser.id),
      exp: payload.exp,
      iat: payload.iat,
    };
    next();
  } catch {
    return next(new Error("Unauthorized"));
  }
});

io.on("connection", async (socket) => {
  console.log("A user is connected", socket.id);

  const userId = socket.user?.sub;
  console.log(`User connected: ${userId} (${socket.id})`);

  // ONLINE TRACKING (Distributed)
  if (userId) {
    const userSocketsKey = `user_sockets:${userId}`;
    const wasOnline = await redis.exists(userSocketsKey);

    await redis.sadd(userSocketsKey, socket.id);
    await redis.sadd("online_users_set", userId); // Track globally
    socket.join(`user-${userId}`);

    if (!wasOnline) {
      // Instead of broadcasting to everyone, we broadcast the new count
      const count = await redis.scard("online_users_set");
      io.emit("online_count", count);
    }
  }

  // Provide a capped list and the total count
  const onlineCount = await redis.scard("online_users_set");
  // Only send the first 50 users to avoid massive payloads
  const allOnlineUsers = await redis.srandmember("online_users_set", 50);

  socket.emit("online_count", onlineCount);
  socket.emit("online_users", allOnlineUsers);

  // JOIN CHANNELS
  socket.on("join-channel", async (channelId: string) => {
    try {
      console.log(`User ${userId} attempting to join channel ${channelId}`);
      if (!userId) return;

      const isMember = await db.query.channelMembers.findFirst({
        where: and(
          eq(channelMembers.channelId, Number(channelId)),
          eq(channelMembers.userId, Number(userId)),
        ),
      });

      if (!isMember) {
        console.log(`User ${userId} is not a member of channel ${channelId}`);
        return;
      }

      socket.join(`channel-${channelId}`);

      // Track channel-specific presence
      await redis.sadd(`channel_online_users:${channelId}`, userId);
      await redis.sadd(`user_channels:${userId}`, channelId);

      // Emit current online users in this channel to the joining user
      const channelOnlineUsers = await redis.smembers(
        `channel_online_users:${channelId}`,
      );
      socket.emit("channel_online_users", {
        channelId,
        users: channelOnlineUsers,
      });

      // Signal others in the channel
      socket.to(`channel-${channelId}`).emit("user-online", userId);

      console.log(
        `User ${userId} successfully joined room: channel-${channelId}`,
      );
    } catch (error) {
      console.error("Error in join-channel:", error);
    }
  });

  socket.on(
    "send-message",
    async ({ channelId, content }: { channelId: string; content: string }) => {
      try {
        console.log(
          `Received send-message from ${userId} for channel ${channelId}`,
        );

        if (!content || !content.trim()) return;
        if (!userId) return;

        const existingUser = await db.query.users.findFirst({
          where: eq(users.id, Number(userId)),
        });

        if (!existingUser) {
          console.log(
            `User ${userId} does not exist in DB during send-message`,
          );
          return;
        }

        const isMember = await db.query.channelMembers.findFirst({
          where: and(
            eq(channelMembers.channelId, Number(channelId)),
            eq(channelMembers.userId, Number(userId)),
          ),
        });

        if (!isMember) {
          console.log(
            `User ${userId} is not a member of channel ${channelId} during send-message`,
          );
          return;
        }

        console.log(`Attempting message insert for channel: ${channelId}`);

        const result = await db.insert(messages).values({
          channelId: Number(channelId),
          authorId: Number(userId),
          content,
          createdAt: new Date(),
        });

        // mysql2 result format: [ResultSetHeader, undefined]
        const insertId = (result as any)[0]?.insertId;
        console.log(`Message inserted with ID: ${insertId}`);

        const messageData = {
          id: String(insertId || Date.now()),
          channelId,
          authorId: String(existingUser.id),
          content,
          authorName: existingUser.name,
          createdAt: new Date().toISOString(),
        };

        const rooms = Array.from(socket.rooms);
        console.log(`Socket ${socket.id} active rooms:`, rooms);

        io.to(`channel-${channelId}`).emit("new-message", messageData);
        console.log(`Socket emission attempted to: channel-${channelId}`);
      } catch (error) {
        console.error("SOCKET ERROR in send-message:", error);
      }
    },
  );

  socket.on("disconnect", async () => {
    console.log("A user disconnected", socket.id);
    if (!userId) return;

    const userSocketsKey = `user_sockets:${userId}`;
    await redis.srem(userSocketsKey, socket.id);

    const remainingSockets = await redis.scard(userSocketsKey);
    if (remainingSockets === 0) {
      await redis.srem("online_users_set", userId); // Remove from global track

      // Clean up channel-specific presence
      const userChannels = await redis.smembers(`user_channels:${userId}`);
      for (const channelId of userChannels) {
        await redis.srem(`channel_online_users:${channelId}`, userId);
        io.to(`channel-${channelId}`).emit("user-offline", userId);
      }
      await redis.del(`user_channels:${userId}`);

      const count = await redis.scard("online_users_set");
      io.emit("online_count", count);
    }
  });
});

export { server, app, io };
