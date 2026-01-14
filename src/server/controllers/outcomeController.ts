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

export const fetchChannelOutcomes = async (req: IRequest, res: Response) => {
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

    const results = await db
      .select({
        id: outcomes.id,
        channelId: outcomes.channelId,
        messageId: outcomes.messageId,
        type: outcomes.type,
        assignedId: outcomes.assigneeId,
        createdBy: outcomes.createdBy,
        createdAt: outcomes.createdAt,
      })
      .from(outcomes)
      .where(eq(outcomes.channelId, channel.id))
      .orderBy(outcomes.createdAt);

    return res.status(200).json({ results });
  } catch (error) {
    console.log("Fetch Outcomes API ERROR: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createChannelOutcome = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id: channelId },
      user,
      body: { messageId, type, assignedId },
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
      where: eq(messages.id, Number(messageId)),
    });

    if (!message || message.channelId !== Number(channelId))
      return res.status(404).json({ message: "Message not found" });

    const assignedMember = await db.query.channelMembers.findFirst({
      where: and(
        eq(channelMembers.channelId, channel.id),
        eq(channelMembers.userId, Number(assignedId))
      ),
    });

    if (!assignedMember)
      return res.status(404).json({ message: "Not a member of the channel" });

    const [inserted] = await db
      .insert(outcomes)
      .values({
        channelId: channel.id,
        messageId: message.id,
        type,
        assigneeId: assignedMember.userId,
        createdBy: existingUser.id,
      })
      .$returningId();

    const currentOutcome = await db.query.outcomes.findFirst({
      where: eq(outcomes.id, inserted.id),
    });

    if (!currentOutcome)
      return res.status(404).json({ message: "Outcome not created properly" });

    return res
      .status(201)
      .json({ currentOutcome, message: "Outcome created successfully" });
  } catch (error) {
    console.log("Create Outcome API ERROR: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteChannelOutcome = async (req: IRequest, res: Response) => {
  try {
    const {
      params: { id: channelId, outcomeId },
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

    const outcome = await db.query.outcomes.findFirst({
      where: and(
        eq(outcomes.id, Number(outcomeId)),
        eq(outcomes.channelId, channel.id)
      ),
    });

    if (!outcome) return res.status(404).json({ message: "Outcome not found" });

    await db.delete(outcomes).where(eq(outcomes.id, outcome.id));

    return res.status(204).json({ message: "Outcome deleted successfully" });
  } catch (error) {
    console.log("Delete Outcome API ERROR: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
