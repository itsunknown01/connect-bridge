import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise.js";
import * as schema from "./schema.ts";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "connect_bridge",
  port: 3306,
});

export const db = drizzle(connection, { schema, mode: "default" });