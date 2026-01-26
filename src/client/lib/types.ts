export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface Channel {
  id: number;
  userId: number;
  name: string;
  messageCount?: number;
  memberCount: number;
}

export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  createdAt: string;
  authorName: string;
}

export interface Member {
  id: string | number;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

export interface Knowledge {
  id: string | number;
  messageId: string | number;
  channelId: string | number;
  content: string;
  authorName: string;
  createdAt: string;
}

export type OutcomeType = "DECISION" | "ACTION";

export interface Outcome {
  id: string | number;
  messageId: string | number;
  channelId: string | number;
  type: OutcomeType;
  content: string;
  authorName: string;
  assigneeName?: string;
  createdAt: string;
}
