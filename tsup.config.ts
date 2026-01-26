import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server/main.ts"],
  outDir: "dist/server",
  format: ["esm"],
  platform: "node",
  shims: true,
  splitting: true,
  dts: false,
  sourcemap: true,
  clean: true,
  minify: true,
  target: "node20",
  // Externalize dependencies that don't bundle well or are provided by the environment
  external: [
    "express",
    "socket.io",
    "ioredis",
    "mysql2",
    "bcryptjs",
    "jsonwebtoken",
    "@socket.io/redis-adapter",
    "drizzle-orm",
    "dotenv",
  ],
  // Ensure we don't try to bundle things that should be at runtime
  noExternal: [],
  banner: {
    js: `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
`,
  },
});
