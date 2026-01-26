import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise.js";
import * as schema from "./schema.ts";

import dotenv from "dotenv";
dotenv.config();

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "connect_bridge",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });
