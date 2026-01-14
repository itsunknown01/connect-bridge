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
      where:
        eq(channelMembers.channelId, Number(channelId)) &&
        eq(channelMembers.userId, existingUser.id),
    });

    if (!isMember)
      return res
        .status(404)
        .json({ message: "User is not member of the channel" });

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

    return res.status(200).json({ items });
  } catch (error) {
    console.log("Fetch Knowledges API ERROR: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
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
      where:
        eq(channelMembers.channelId, Number(channelId)) &&
        eq(channelMembers.userId, existingUser.id),
    });

    if (!isMember)
      return res
        .status(404)
        .json({ message: "User is not member of the channel" });

    const message = await db.query.messages.findFirst({
      where: eq(messages.id, Number(sourceMessageId)),
    });

    if (!message || message.channelId !== Number(channelId)) {
      return res.status(404).json({ error: "Message not found" });
    }

    const title =
      message.content.length > 80
        ? message.content.slice(0, 77) + "..."
        : message.content;

    const [inserted] = await db
      .insert(knowledgeArtifacts)
      .values({
        channelId: Number(channelId),
        sourceMessageId,
        title,
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
      return res
        .status(404)
        .json({ message: "Knowledge is not assigned by author" });

    const currentKnowledge = await db.query.knowledgeArtifacts.findFirst({
      where: eq(knowledgeArtifacts.id, inserted.id),
    });

    if (!currentKnowledge)
      return res.status(404).json({ message: "Knowledge is not found" });

    return res.status(201).json({
      knowledge: {
        id: currentKnowledge.id,
        messageId: currentKnowledge.sourceMessageId,
        channelId,
        content: currentKnowledge.content,
        authorName: author?.name ?? "Unknown",
        createdAt: currentKnowledge.createdAt,
      },
    });
  } catch (error) {
    console.log("Create Knowledge API ERROR: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
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
      where:
        eq(channelMembers.channelId, Number(channelId)) &&
        eq(channelMembers.userId, existingUser.id),
    });

    if (!isMember)
      return res
        .status(404)
        .json({ message: "User is not member of the channel" });

    const currentKnowledge = await db.query.knowledgeArtifacts.findFirst({
      where: eq(knowledgeArtifacts.id, Number(knowledgeId)),
    });

    if (!currentKnowledge)
      return res.status(404).json({ message: "Knowledge is not found" });

    await db
      .delete(knowledgeArtifacts)
      .where(
        and(
          eq(knowledgeArtifacts.id, Number(knowledgeId)),
          eq(knowledgeArtifacts.channelId, Number(channelId))
        )
      );

    return res.status(204).json({ message: "Knowledge deleted successfully" });
  } catch (error) {
    console.log("Delete Knowledge API ERROR: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
