import http from "http";
import express from "express";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { and, eq, ne } from "drizzle-orm";
import { db } from "./db.ts";
import { channelMembers, messages } from "./schema.ts";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const cookies = socket.request.headers.cookie;
  if (!cookies) return next(new Error("Unauthorized"));

  const token = cookies
    .split("; ")
    .find((c) => c.startsWith("accessToken="))
    ?.split("=")[1];

  if (!token) return next(new Error("Unauthorized"));

  try {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    socket.user = payload as any;
    next();
  } catch {
    return next(new Error("Unauthorized"));
  }
});

const onlineUsers = new Map<string, Set<string>>();

io.on("connection", (socket) => {
  console.log("A user is connected", socket.id);

  const userId = socket.user?.sub;

  // ONLINE TRACKING
  if (!onlineUsers.has(userId as string)) {
    onlineUsers.set(userId as string, new Set());
    io.emit("user-online", userId);
  }

  onlineUsers.get(userId as string)?.add(socket.id);

  socket.emit("online_users", Array.from(onlineUsers.keys()));

  // JOIN CHANNELS

  socket.on("join-channel", async (channelId: string) => {
    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, Number(userId))
      ),
    });

    if (!isMember) return;

    socket.join(`channel-${channelId}`);
  });

  socket.on("send-message",async ({ channelId, content }: { channelId: string; content: string }) => {
    if (!content || !content.trim()) return;

    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, Number(userId))
      ),
    });

    if (!isMember) return;

    await db.insert(messages).values({
      channelId: Number(channelId),
      authorId: Number(userId),
      content,
      createdAt: new Date(),
    })

    io.to(`channel-${channelId}`).emit("new-message", {
      channelId,
      authorId: userId,
      content,
      createdAt: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    const userSockets = onlineUsers.get(userId as string);
    if (!userSockets) return;

    userSockets.delete(socket.id);

    if (userSockets.size === 0) {
      onlineUsers.delete(userId as string);
      io.emit("user-offline", userId);
    }
  });
});

export { server, app };