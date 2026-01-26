import { Response } from "express";
import { IRequest } from "../types/index.ts";
import { db } from "../config/db.ts";
import {
  channelMembers,
  channels,
  knowledgeArtifacts,
  messages,
  users,
} from "../config/schema.ts";
import { and, asc, eq } from "drizzle-orm";
import {
  sendBadRequest,
  sendCreated,
  sendForbidden,
  sendNotFound,
  sendResponse,
  sendServerError,
  sendSuccess,
  sendUnauthorized,
} from "../helpers/response.ts";

export const fetchChannelKnowledge = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id: channelId },
      user,
    } = req;

    if (!user || !user.email) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (!existingUser || !existingUser.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, Number(channelId)),
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, user.id),
      ),
    });

    if (!isMember)
      return sendForbidden(res, "User is not member of the channel");

    const items = await db
      .select({
        id: knowledgeArtifacts.id,
        messageId: knowledgeArtifacts.sourceMessageId,
        channelId: knowledgeArtifacts.channelId,
        content: knowledgeArtifacts.content,
        authorName: users.name,
        createdAt: knowledgeArtifacts.createdAt,
      })
      .from(knowledgeArtifacts)
      .innerJoin(users, eq(users.id, knowledgeArtifacts.authorId))
      .where(eq(users.id, knowledgeArtifacts.authorId))
      .orderBy(asc(knowledgeArtifacts.createdAt));

    return sendResponse(res, 200, { items, channelId });
  } catch (error) {
    return sendServerError(res, "Fetch Knowledge Error", error);
  }
};

export const createChannelKnowledge = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id: channelId },
      user,
      body: { messageId: sourceMessageId },
    } = req;

    if (!user || !user.email) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (!existingUser || !existingUser.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, Number(channelId)),
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, existingUser.id),
      ),
    });

    if (!isMember)
      return res
        .status(404)
        .json({ message: "User is not member of the channel" });

    const message = await db.query.messages.findFirst({
      where: eq(messages.id, Number(sourceMessageId)),
    });

    if (!message || message.channelId !== Number(channelId)) {
      return sendNotFound(res, "Message not found");
    }

    const [inserted] = await db
      .insert(knowledgeArtifacts)
      .values({
        channelId: Number(channelId),
        sourceMessageId,
        authorId: message.authorId,
        content: message.content,
      })
      .$returningId();

    const author = await db.query.users.findFirst({
      where: eq(users.id, message.authorId),
      columns: {
        name: true,
      },
    });

    if (!author)
      return sendNotFound(res, "Knowledge is not assigned by author");

    const currentKnowledge = await db.query.knowledgeArtifacts.findFirst({
      where: eq(knowledgeArtifacts.id, inserted.id),
    });

    if (!currentKnowledge) return sendNotFound(res, "Knowledge is not found");

    return sendCreated(res, "Knowledge created successfully", {
      knowledge: {
        id: currentKnowledge.id,
        messageId: currentKnowledge.sourceMessageId,
        channelId,
        content: currentKnowledge.content,
        authorName: author?.name ?? "Unknown",
        createdAt: currentKnowledge.createdAt,
      },
      channelId,
    });
  } catch (error) {
    return sendServerError(res, "Create Knowledge Error", error);
  }
};

export const deleteChannelKnowledge = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id: channelId, knowledgeId },
      user,
    } = req;

    if (!user || !user.email) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (!existingUser || !existingUser.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, Number(channelId)),
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, existingUser.id),
      ),
    });

    if (!isMember)
      return res
        .status(404)
        .json({ message: "User is not member of the channel" });

    const currentKnowledge = await db.query.knowledgeArtifacts.findFirst({
      where: eq(knowledgeArtifacts.id, Number(knowledgeId)),
    });

    if (!currentKnowledge) return sendNotFound(res, "Knowledge is not found");

    await db
      .delete(knowledgeArtifacts)
      .where(
        and(
          eq(knowledgeArtifacts.id, Number(knowledgeId)),
          eq(knowledgeArtifacts.channelId, Number(channelId)),
        ),
      );

    return sendSuccess(res, "Knowledge deleted successfully", {
      knowledgeId,
      channelId,
    });
  } catch (error) {
    return sendServerError(res, "Delete Knowledge Error", error);
  }
};
