import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { sql } from "drizzle-orm";
import {
  int,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// Re-define schema inline to avoid path issues
const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

const channels = mysqlTable("channels", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

const channelMembers = mysqlTable(
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

const messages = mysqlTable("messages", {
  id: int("id").primaryKey().autoincrement(),
  channelId: int("channel_id").notNull(),
  authorId: int("author_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

const knowledgeArtifacts = mysqlTable("knowledge_artifacts", {
  id: int("id").primaryKey().autoincrement(),
  channelId: int("channel_id").notNull(),
  sourceMessageId: int("message_id").notNull(),
  authorId: int("author_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

const outcomes = mysqlTable("outcomes", {
  id: int("id").primaryKey().autoincrement(),
  channelId: int("channel_id").notNull(),
  messageId: int("message_id").notNull(),
  type: varchar("type", { length: 10 }).notNull(),
  assigneeId: int("assignee_id"),
  createdBy: int("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

async function clearDatabase() {
  console.log("🗑️  Clearing all database data...\n");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "connect_bridge",
  });

  const db = drizzle(connection);

  try {
    // Disable foreign key checks temporarily
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);

    // Delete in order (child tables first)
    await db.delete(outcomes);
    console.log("  ✓ Cleared outcomes");

    await db.delete(knowledgeArtifacts);
    console.log("  ✓ Cleared knowledge_artifacts");

    await db.delete(messages);
    console.log("  ✓ Cleared messages");

    await db.delete(channelMembers);
    console.log("  ✓ Cleared channel_members");

    await db.delete(channels);
    console.log("  ✓ Cleared channels");

    await db.delete(users);
    console.log("  ✓ Cleared users");

    // Re-enable foreign key checks
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

    console.log("\n✅ All database data cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
  } finally {
    await connection.end();
  }

  process.exit(0);
}

clearDatabase();
