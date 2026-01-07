import { and, eq, like } from "drizzle-orm";
import { Response } from "express";
import { db } from "../config/db.ts";
import { channelMembers, messages, users } from "../config/schema.ts";
import { IRequest } from "../types/index.ts";

export async function getMessages(req: IRequest, res: Response) {
  try {
    const {
      params: { id },
      user,
    } = req;

    const limit = Math.min(Number(req.query.limit) || 50, 100);

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
        eq(channelMembers.channelId, Number(id)),
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
      })
      .from(messages)
      .where(eq(messages.channelId, Number(id)))
      .orderBy(messages.createdAt)
      .limit(limit);

    return res.status(200).json({ messages: channelMessages });
  } catch (error) {
    console.log("Get Messages API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function MessageSearch(req: IRequest, res: Response) {
  try {
    const {
      params: { id },
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

    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(id)),
        eq(channelMembers.userId, existingUser.id)
      ),
    });

    if (!isMember) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const results = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.channelId, Number(id)),
          like(messages.content, `%${query}%`)
        )
      )
      .orderBy(messages.createdAt)
      .limit(50);

    return res.status(200).json({ messages: results });
  } catch (error) {
    console.log("Message Search API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
