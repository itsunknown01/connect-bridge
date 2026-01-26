import {
  int,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const channels = mysqlTable("channels", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const channelMembers = mysqlTable(
  "channel_members",
  {
    userId: int("user_id").notNull(),
    channelId: int("channel_id").notNull(),
    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.channelId] }),
  }),
);

export const messages = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),
  channelId: int("channel_id").notNull(),
  authorId: int("author_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const knowledgeArtifacts = mysqlTable("knowledge_artifacts", {
  id: int("id").primaryKey().autoincrement(),
  channelId: int("channel_id").notNull(),
  sourceMessageId: int("message_id").notNull(),
  authorId: int("author_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const outcomes = mysqlTable("outcomes", {
  id: int("id").primaryKey().autoincrement(),
  channelId: int("channel_id").notNull(),
  messageId: int("message_id").notNull(),
  type: varchar("type", { length: 10 })
    .$type<"decision" | "action">()
    .notNull(),
  assigneeId: int("assignee_id"),
  createdBy: int("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
