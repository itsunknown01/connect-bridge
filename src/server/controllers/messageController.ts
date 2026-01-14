import { and, eq, like } from "drizzle-orm";
import { Response } from "express";
import { db } from "../config/db.ts";
import { channelMembers, messages, users } from "../config/schema.ts";
import { IRequest } from "../types/index.ts";

export async function getMessages(req: IRequest, res: Response) {
  try {
    const {
      params: { id: channelId },
      user,
      query: { limit },
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

    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, existingUser.id)
      ),
    });

    if (!isMember) {
      return res.status(403).json({ message: "Forbidden" });
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
      .where(eq(messages.channelId, Number(channelId)))
      .orderBy(messages.createdAt)
      .limit(Number(limit) || 50);

    return res.status(200).json({ messages: channelMessages });
  } catch (error) {
    console.log("Get Messages API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function MessageSearch(req: IRequest, res: Response) {
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

    const search = req.query.search;
    const limitRaw = Number(req.query.limit);

    if (!search || typeof search !== "string") {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    if (!Number.isInteger(limitRaw) || limitRaw <= 0) {
      return res.status(400).json({ error: "Invalid limit" });
    }

    const limit = Math.min(limitRaw, 100);

    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, existingUser.id)
      ),
    });

    if (!isMember) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const whereCondition = search
      ? and(
          eq(messages.channelId, Number(channelId)),
          like(messages.content, `%${search}%`)
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

    return res.status(200).json({ messages: results });
  } catch (error) {
    console.log("Message Search API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
