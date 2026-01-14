import { ChannelsSchema } from "@/schemas/index.ts";
import { and, asc, eq, sql } from "drizzle-orm";
import { Response } from "express";
import { db } from "../config/db.ts";
import { channelMembers, channels, messages, users } from "../config/schema.ts";
import { IRequest } from "../types/index.ts";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export const getChannels = async (req: IRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user || !user.email) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (!existingUser || !existingUser.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingChannels = await db
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
      .leftJoin(messages, eq(channels.id, messages.channelId))
      .where(eq(channels.userId, existingUser.id))
      .groupBy(channels.id);

    if (!existingChannels) {
      return res.status(404).json({ message: "No channels found" });
    }

    return res.status(200).json({ channels: existingChannels });
  } catch (error) {
    console.log("Get Channels API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getChannelById = async (req: IRequest, res: Response) => {
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

    const channel = await db.query.channels.findFirst({
      where:
        eq(channels.id, Number(id)) && eq(channels.userId, existingUser.id),
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    return res.status(200).json({ channel });
  } catch (error) {
    console.log("Get Channel By ID API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const joinChannel = async (req: IRequest, res: Response) => {
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

    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, Number(id)),
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const isMember = await db.query.channelMembers.findFirst({
      where:
        eq(channelMembers.channelId, Number(id)) &&
        eq(channelMembers.userId, existingUser.id),
    });

    if (isMember) {
      return res
        .status(200)
        .json({ message: "Already a member of the channel" });
    }

    await db
      .insert(channelMembers)
      .values({
        channelId: Number(id),
        userId: existingUser.id,
      })
      .execute();

    return res.status(200).json({
      message: "Joined channel successfully",
      channel: {
        id: channel.id,
        name: channel.name,
      },
    });
  } catch (error) {
    console.log("Join Channel API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchChannelMembers = async (req: IRequest, res: Response) => {
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

    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, Number(id)),
    });
    
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const isMember = await db.query.channelMembers.findFirst({
      where:
        eq(channelMembers.channelId, Number(id)) &&
        eq(channelMembers.userId, existingUser.id),
    });

    if (!isMember)
      return res
        .status(404)
        .json({ message: "User is not member of the channel" });

    const members = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        joinedAt: channelMembers.joinedAt,
      })
      .from(channelMembers)
      .innerJoin(users, eq(channelMembers.userId, users.id))
      .where(eq(channelMembers.channelId, channel.id))
      .orderBy(asc(channelMembers.joinedAt));

    return res.status(200).json({ members });
  } catch (error) {
    console.log("Fetch Channel Members API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createChannel = async (req: IRequest, res: Response) => {
  try {
    const validation = ChannelsSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ message: "Invalid fields" });
    }

    const { name } = validation.data;

    const user = req.user;

    if (!user || !user.email) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (!existingUser || !existingUser.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let result: MySqlRawQueryResult | undefined;

    await db.transaction(async (tx) => {
      result = await tx
        .insert(channels)
        .values({
          name,
          userId: existingUser.id,
        })
        .execute();

      if (result && result[0]) {
        await tx.insert(channelMembers).values({
          channelId: Number(result[0].insertId),
          userId: existingUser.id,
        });
      }
    });

    if (!result || !result[0]) {
      return res.status(404).json({ message: "Channel not created" });
    }

    const channel = await db.query.channels.findFirst({
      where: eq(channels.id, result[0].insertId),
    });

    if (!channel)
      return res.status(404).json({ message: "Channel does not exist" });

    return res
      .status(201)
      .json({ message: "Channel created successfully", channel });
  } catch (error) {
    console.log("Create Channel API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateChannel = async (req: IRequest, res: Response) => {
  try {
    const validation = ChannelsSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ message: "Invalid fields" });
    }

    const { name } = validation.data;

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

    const existingChannel = await db.query.channels.findFirst({
      where:
        eq(channels.id, Number(id)) && eq(channels.userId, existingUser.id),
    });

    if (!existingChannel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    await db
      .update(channels)
      .set({ name })
      .where(
        eq(channels.id, Number(id)) && eq(channels.userId, existingUser.id)
      )
      .execute();

    return res.status(200).json({ message: "Channel updated successfully" });
  } catch (error) {
    console.log("Update Channel API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteChannel = async (req: IRequest, res: Response) => {
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

    const existingChannel = await db.query.channels.findFirst({
      where:
        eq(channels.id, Number(id)) && eq(channels.userId, existingUser.id),
    });

    if (!existingChannel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    await db
      .delete(channels)
      .where(
        eq(channels.id, Number(id)) && eq(channels.userId, existingUser.id)
      )
      .execute();

    return res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    console.log("Delete Channel API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
