import { Response } from "express";
import { IRequest } from "../types/index.ts";
import { db } from "../config/db.ts";
import {
  channelMembers,
  channels,
  messages,
  outcomes,
  users,
} from "../config/schema.ts";
import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";
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

export const fetchChannelOutcomes = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id: channelId },
      user,
    } = req;

    if (!user) return sendUnauthorized(res);

    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, user.id),
      ),
    });

    if (!isMember)
      return sendForbidden(res, "User is not member of the channel");

    const assigneeAlias = alias(users, "assignee");
    const authorAlias = alias(users, "author");

    const results = await db
      .select({
        id: outcomes.id,
        channelId: outcomes.channelId,
        messageId: outcomes.messageId,
        type: outcomes.type,
        assignedId: outcomes.assigneeId,
        createdBy: outcomes.createdBy,
        createdAt: outcomes.createdAt,
        content: messages.content,
        authorName: authorAlias.name,
        assigneeName: assigneeAlias.name,
      })
      .from(outcomes)
      .innerJoin(messages, eq(outcomes.messageId, messages.id))
      .innerJoin(authorAlias, eq(messages.authorId, authorAlias.id))
      .leftJoin(assigneeAlias, eq(outcomes.assigneeId, assigneeAlias.id))
      .where(eq(outcomes.channelId, Number(channelId)))
      .orderBy(outcomes.createdAt);

    return sendResponse(res, 200, { results });
  } catch (error) {
    return sendServerError(res, "Fetch Outcomes Error", error);
  }
};

export const createChannelOutcome = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id: channelId },
      user,
      body: { messageId, type, assignedId },
    } = req;

    if (!user) return sendUnauthorized(res);

    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, user.id),
      ),
    });

    if (!isMember)
      return sendForbidden(res, "User is not member of the channel");

    const message = await db.query.messages.findFirst({
      where: eq(messages.id, Number(messageId)),
    });

    if (!message || message.channelId !== Number(channelId))
      return res.status(404).json({ message: "Message not found" });

    let assignedUserId = null;
    if (assignedId) {
      const assignedMember = await db.query.channelMembers.findFirst({
        where: and(
          eq(channelMembers.channelId, Number(channelId)),
          eq(channelMembers.userId, Number(assignedId)),
        ),
      });

      if (!assignedMember)
        return sendNotFound(res, "Assignee is not a member of the channel");

      assignedUserId = assignedMember.userId;
    }

    const [inserted] = await db
      .insert(outcomes)
      .values({
        channelId: Number(channelId),
        messageId: message.id,
        type,
        assigneeId: assignedUserId,
        createdBy: user.id,
      })
      .$returningId();

    // Fetch enriched outcome for immediate UI update
    const assigneeAlias = alias(users, "assignee");
    const authorAlias = alias(users, "author");

    const [currentOutcome] = await db
      .select({
        id: outcomes.id,
        channelId: outcomes.channelId,
        messageId: outcomes.messageId,
        type: outcomes.type,
        assignedId: outcomes.assigneeId,
        createdBy: outcomes.createdBy,
        createdAt: outcomes.createdAt,
        content: messages.content,
        authorName: authorAlias.name,
        assigneeName: assigneeAlias.name,
      })
      .from(outcomes)
      .innerJoin(messages, eq(outcomes.messageId, messages.id))
      .innerJoin(authorAlias, eq(messages.authorId, authorAlias.id))
      .leftJoin(assigneeAlias, eq(outcomes.assigneeId, assigneeAlias.id))
      .where(eq(outcomes.id, inserted.id));

    if (!currentOutcome)
      return sendNotFound(res, "Outcome not created properly");

    return sendCreated(res, "Outcome created successfully", { currentOutcome });
  } catch (error) {
    return sendServerError(res, "Create Outcome Error", error);
  }
};

export const deleteChannelOutcome = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id: channelId, outcomeId },
      user,
    } = req;

    if (!user) return sendUnauthorized(res);

    const isMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, Number(channelId)),
        eq(channelMembers.userId, user.id),
      ),
    });

    if (!isMember)
      return sendForbidden(res, "User is not member of the channel");

    const outcome = await db.query.outcomes.findFirst({
      where: and(
        eq(outcomes.id, Number(outcomeId)),
        eq(outcomes.channelId, Number(channelId)),
      ),
    });

    if (!outcome) return res.status(404).json({ message: "Outcome not found" });

    await db.delete(outcomes).where(eq(outcomes.id, outcome.id));

    return sendResponse(res, 204, { message: "Outcome deleted successfully" });
  } catch (error) {
    return sendServerError(res, "Delete Outcome Error", error);
  }
};
