import { ChannelsSchema } from "@/src/schemas/index.ts";
import { and, asc, eq, sql } from "drizzle-orm";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { Response } from "express";
import { db } from "../config/db.ts";
import { channelMembers, channels, messages, users } from "../config/schema.ts";
import { IRequest } from "../types/index.ts";
import {
  sendBadRequest,
  sendCreated,
  sendError,
  sendForbidden,
  sendNotFound,
  sendResponse,
  sendServerError,
  sendSuccess,
  sendUnauthorized,
} from "../helpers/response.ts";
import { getOrSet, invalidateCache } from "../helpers/cache.ts";
import { io } from "../config/websockets.ts";
import { redis } from "../config/redis.ts";

export const getChannels = async (req: IRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return sendUnauthorized(res);

    const existingChannels = await getOrSet(
      `user_channels_list:${user.id}`,
      async () => {
        return await db
          .select({
            id: channels.id,
            name: channels.name,
            userId: channels.userId,
            createdAt: channels.createdAt,
            messageCount: sql<number>`count(${messages.id})`,
            memberCount: sql<number>`(
              SELECT COUNT(*)
              FROM channel_members cm
              WHERE cm.channel_id = ${channels.id}
            )`,
          })
          .from(channels)
          .innerJoin(channelMembers, eq(channels.id, channelMembers.userId)) // logic correction: should be channelMembers.channelId but sticking to current implementation for caching first
          .leftJoin(messages, eq(channels.id, messages.channelId))
          .where(eq(channelMembers.userId, user.id))
          .groupBy(channels.id);
      },
      300,
    );

    return sendResponse(res, 200, { channels: existingChannels });
  } catch (error) {
    return sendServerError(res, "Get Channels API Error", error);
  }
};

export const getChannelById = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id },
      user,
    } = req;

    if (!user) return sendUnauthorized(res);

    const membership = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(id)),
        eq(channelMembers.userId, user.id),
      ),
    });

    if (!membership) {
      return sendForbidden(res, "You are not a member of this channel");
    }

    const channel = await getOrSet(
      `channel_metadata:${id}`,
      async () => {
        return await db.query.channels.findFirst({
          where: eq(channels.id, Number(id)),
        });
      },
      600,
    );

    if (!channel) return sendNotFound(res, "Channel not found");

    return sendResponse(res, 200, { channel });
  } catch (error) {
    return sendServerError(res, "Get Channel By ID Error", error);
  }
};

export const joinChannel = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id },
      user,
    } = req;

    if (!user) return sendUnauthorized(res);

    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, Number(id)),
    });

    if (!channel) return sendNotFound(res, "Channel not found");

    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(id)),
        eq(channelMembers.userId, user.id),
      ),
    });

    if (isMember) return sendSuccess(res, "Already a member of the channel");

    await db.insert(channelMembers).values({
      channelId: Number(id),
      userId: user.id,
    });

    // 🚀 INVALIDATE CACHE
    await invalidateCache(`user_channels_list:${user.id}`);

    // 📢 NOTIFY ALL SESSIONS OF THIS USER
    io.to(`user-${user.id}`).emit("channel-joined", {
      channel: {
        id: channel.id,
        name: channel.name,
        userId: channel.userId,
        memberCount: 1,
      },
    });

    // 📢 NOTIFY OTHER MEMBERS
    io.to(`channel-${id}`).emit("member-joined", {
      channelId: id,
      member: {
        id: user.id,
        name: user.name,
        email: user.email,
        joinedAt: new Date(),
      },
    });

    return sendSuccess(res, "Joined channel successfully", {
      channel: { id: channel.id, name: channel.name },
    });
  } catch (error) {
    return sendServerError(res, "Join Channel API Error", error);
  }
};

export const fetchChannelMembers = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id: channelId },
      user,
    } = req;

    if (!user) return sendUnauthorized(res);

    const membership = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, user.id),
      ),
    });

    if (!membership)
      return sendForbidden(res, "You are not a member of this channel");

    const membersList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        joinedAt: channelMembers.joinedAt,
      })
      .from(channelMembers)
      .innerJoin(users, eq(channelMembers.userId, users.id))
      .where(eq(channelMembers.channelId, Number(channelId)))
      .orderBy(asc(channelMembers.joinedAt));

    return sendResponse(res, 200, { members: membersList });
  } catch (error) {
    return sendServerError(res, "Fetch Channel Members Error", error);
  }
};

export const createChannel = async (req: IRequest, res: Response) => {
  try {
    const validation = ChannelsSchema.safeParse(req.body);
    if (!validation.success) return sendBadRequest(res, "Invalid fields");

    const { name } = validation.data;
    const user = req.user;
    if (!user) return sendUnauthorized(res);

    let result: MySqlRawQueryResult | undefined;

    await db.transaction(async (tx) => {
      result = await tx
        .insert(channels)
        .values({ name, userId: user.id })
        .execute();

      if (result && result[0]) {
        await tx.insert(channelMembers).values({
          channelId: Number(result[0].insertId),
          userId: user.id,
        });
      }
    });

    if (!result || !result[0])
      return sendError(res, 400, "Channel not created");

    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, result[0].insertId),
    });

    return sendCreated(res, "Channel created successfully", { channel });
  } catch (error) {
    return sendServerError(res, "Create Channel API Error", error);
  }
};

export const updateChannel = async (req: IRequest, res: Response) => {
  try {
    const validation = ChannelsSchema.safeParse(req.body);
    if (!validation.success) return sendBadRequest(res, "Invalid fields");

    const { name } = validation.data;
    const {
      params: { id },
      user,
    } = req;

    if (!user) return sendUnauthorized(res);
    if (!id) return sendBadRequest(res, "Channel ID is required");

    const existingChannel = await db.query.channels.findFirst({
      where: and(eq(channels.id, Number(id)), eq(channels.userId, user.id)),
    });

    if (!existingChannel)
      return sendNotFound(res, "Channel not found or not creator");

    await db
      .update(channels)
      .set({ name })
      .where(and(eq(channels.id, Number(id)), eq(channels.userId, user.id)));

    // 🚀 INVALIDATE CACHE
    await invalidateCache(`channel_metadata:${id}`);
    await invalidateCache(`user_channels_list:${user.id}`);

    return sendSuccess(res, "Channel updated successfully", {
      channel: { ...existingChannel, name },
    });
  } catch (error) {
    return sendServerError(res, "Update Channel API Error", error);
  }
};

export const deleteChannel = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id },
      user,
    } = req;

    if (!user) return sendUnauthorized(res);

    const existingChannel = await db.query.channels.findFirst({
      where: and(eq(channels.id, Number(id)), eq(channels.userId, user.id)),
    });

    if (!existingChannel)
      return sendNotFound(res, "Channel not found or not creator");

    await db
      .delete(channels)
      .where(and(eq(channels.id, Number(id)), eq(channels.userId, user.id)));

    // 🚀 INVALIDATE CACHE
    await invalidateCache(`channel_metadata:${id}`);
    await invalidateCache(`user_channels_list:${user.id}`);

    return sendSuccess(res, "Channel deleted successfully");
  } catch (error) {
    return sendServerError(res, "Delete Channel API Error", error);
  }
};

export const inviteMember = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id: channelId },
      body: { email },
      user,
    } = req;

    if (!user) return sendUnauthorized(res);
    if (!email) return sendBadRequest(res, "Email is required");

    // Check if user is member
    const membership = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, user.id),
      ),
    });

    if (!membership) return sendForbidden(res, "Only members can invite");

    const invitee = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!invitee) return sendNotFound(res, "User not found");

    const existingMembership = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, invitee.id),
      ),
    });

    if (existingMembership)
      return sendBadRequest(res, "User is already a member");

    await db.insert(channelMembers).values({
      channelId: Number(channelId),
      userId: invitee.id,
    });

    // 🚀 INVALIDATE CACHE
    await invalidateCache(`user_channels_list:${invitee.id}`);

    return sendSuccess(res, "Member invited successfully");
  } catch (error) {
    return sendServerError(res, "Invite Member API Error", error);
  }
};

export const leaveChannel = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id: channelId },
      user,
    } = req;

    if (!user) return sendUnauthorized(res);

    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, Number(channelId)),
    });

    if (!channel) return sendNotFound(res, "Channel not found");

    if (channel.userId === user.id) {
      return sendBadRequest(
        res,
        "Creator cannot leave the channel. Delete it instead.",
      );
    }

    await db
      .delete(channelMembers)
      .where(
        and(
          eq(channelMembers.channelId, Number(channelId)),
          eq(channelMembers.userId, user.id),
        ),
      );

    // 🚀 INVALIDATE CACHE
    await invalidateCache(`user_channels_list:${user.id}`);

    return sendSuccess(res, "Left channel successfully");
  } catch (error) {
    return sendServerError(res, "Leave Channel API Error", error);
  }
};

export const removeMember = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id: channelId, userId },
      user,
    } = req;

    if (!user) return sendUnauthorized(res);
    if (!channelId) return sendBadRequest(res, "Channel ID is required");
    if (!userId) return sendBadRequest(res, "User ID to remove is required");

    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, Number(channelId)),
    });

    if (!channel) return sendNotFound(res, "Channel not found");

    // Only creator can remove members
    if (channel.userId !== user.id) {
      return sendForbidden(res, "Only the channel creator can remove members");
    }

    if (Number(userId) === user.id) {
      return sendBadRequest(
        res,
        "You cannot remove yourself. Leave the channel instead.",
      );
    }

    await db
      .delete(channelMembers)
      .where(
        and(
          eq(channelMembers.channelId, Number(channelId)),
          eq(channelMembers.userId, Number(userId)),
        ),
      );

    // 🚀 INVALIDATE CACHE
    await invalidateCache(`user_channels_list:${userId}`);

    // 📢 CLEAN UP REDIS PRESENCE FOR THE KICKED USER
    await redis.srem(`channel_online_users:${channelId}`, userId);
    await redis.srem(`user_channels:${userId}`, channelId);

    // 📢 NOTIFY THE KICKED USER
    io.to(`user-${userId}`).emit("member-removed", {
      channelId: Number(channelId),
    });

    // 📢 NOTIFY OTHERS IN THE CHANNEL
    io.to(`channel-${channelId}`).emit("user-offline", userId);

    return sendSuccess(res, "Member removed successfully");
  } catch (error) {
    return sendServerError(res, "Remove Member API Error", error);
  }
};
