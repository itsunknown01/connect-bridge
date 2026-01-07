import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/config/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host: "localhost",
    port: 3306,
    user: "root",
    database: "connect_bridge",
  },
  verbose: true,
  strict: true,
});
