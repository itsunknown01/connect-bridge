import { and, eq, like, lt, desc, or } from "drizzle-orm";
import { Response } from "express";
import { db } from "../config/db.ts";
import { channelMembers, channels, messages, users } from "../config/schema.ts";
import { IRequest } from "../types/index.ts";
import { io } from "../config/websockets.ts";
import {
  sendBadRequest,
  sendForbidden,
  sendNotFound,
  sendResponse,
  sendServerError,
  sendSuccess,
  sendUnauthorized,
} from "../helpers/response.ts";

export async function getMessages(req: IRequest, res: Response) {
  try {
    const {
      params: { id: channelId },
      user,
    } = req;

    const limit = Number(req.query.limit) || 50;
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;

    if (!user) return sendUnauthorized(res);

    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, user.id),
      ),
    });

    if (!isMember) return sendForbidden(res);

    // Build the query
    let whereCondition = eq(messages.channelId, Number(channelId));
    if (cursor) {
      whereCondition = and(whereCondition, lt(messages.id, cursor)) as any;
    }

    const channelMessages = await db
      .select({
        id: messages.id,
        channelId: messages.channelId,
        authorId: messages.authorId,
        content: messages.content,
        createdAt: messages.createdAt,
        authorName: users.name,
      })
      .from(messages)
      .innerJoin(users, eq(messages.authorId, users.id))
      .where(whereCondition)
      .orderBy(desc(messages.createdAt))
      .limit(limit);

    // Return in chronological order
    return sendResponse(res, 200, {
      messages: [...channelMessages].reverse(),
      nextCursor:
        channelMessages.length === limit
          ? channelMessages[channelMessages.length - 1].id
          : null,
    });
  } catch (error) {
    return sendServerError(res, "Get Messages Error", error);
  }
}

export async function MessageSearch(req: IRequest, res: Response) {
  try {
    const {
      params: { id: channelId },
      user,
    } = req;

    if (!user) return sendUnauthorized(res);

    const search = req.query.search;
    const limitRaw = Number(req.query.limit) || 20;

    if (!search || typeof search !== "string") {
      return sendBadRequest(res, "Query parameter is required");
    }

    const limit = Math.min(limitRaw, 100);

    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, user.id),
      ),
    });

    if (!isMember) return sendForbidden(res);

    const whereCondition = search
      ? and(
          eq(messages.channelId, Number(channelId)),
          like(messages.content, `%${search}%`),
        )
      : eq(messages.channelId, Number(channelId));

    const results = await db
      .select({
        id: messages.id,
        channelId: messages.channelId,
        authorId: messages.authorId,
        content: messages.content,
        createdAt: messages.createdAt,
        authorName: users.name,
      })
      .from(messages)
      .innerJoin(users, eq(messages.authorId, users.id))
      .where(whereCondition)
      .orderBy(messages.createdAt)
      .limit(limit);

    return sendResponse(res, 200, { messages: results });
  } catch (error) {
    return sendServerError(res, "Message Search Error", error);
  }
}

export async function updateMessage(req: IRequest, res: Response) {
  try {
    const {
      params: { id: channelId, messageId },
      body: { content },
      user,
    } = req;

    if (!user) return sendUnauthorized(res);

    if (!content || content.trim().length === 0) {
      return sendBadRequest(res, "Content is required");
    }

    const message = await db.query.messages.findFirst({
      where: and(
        eq(messages.id, Number(messageId)),
        eq(messages.channelId, Number(channelId)),
      ),
    });

    if (!message) return sendNotFound(res, "Message not found");

    if (message.authorId !== user.id) return sendForbidden(res);

    await db
      .update(messages)
      .set({ content })
      .where(eq(messages.id, message.id));

    io.to(`channel-${channelId}`).emit("message-updated", {
      id: message.id,
      channelId,
      content,
    });

    return sendSuccess(res, "Message updated successfully");
  } catch (error) {
    return sendServerError(res, "Update Message Error", error);
  }
}

export async function deleteMessage(req: IRequest, res: Response) {
  try {
    const {
      params: { id: channelId, messageId },
      user,
    } = req;

    if (!user) return sendUnauthorized(res);

    const message = await db.query.messages.findFirst({
      where: and(
        eq(messages.id, Number(messageId)),
        eq(messages.channelId, Number(channelId)),
      ),
    });

    if (!message) return sendNotFound(res, "Message not found");

    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, Number(channelId)),
    });

    // Only author or channel creator can delete
    if (message.authorId !== user.id && channel?.userId !== user.id) {
      return sendForbidden(res);
    }

    await db.delete(messages).where(eq(messages.id, message.id));

    io.to(`channel-${channelId}`).emit("message-deleted", {
      id: message.id,
      channelId,
    });

    return sendSuccess(res, "Message deleted successfully");
  } catch (error) {
    return sendServerError(res, "Delete Message Error", error);
  }
}
