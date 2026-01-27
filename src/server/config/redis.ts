import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Support REDIS_URL (Upstash format) or separate host/port/password
const redisUrl = process.env.REDIS_URL;
export const isRedisConfigured =
  !!redisUrl ||
  (process.env.REDIS_HOST && process.env.REDIS_HOST !== "localhost");

// Options for the main redis client (caching) - can be lazy
const cacheClientOptions = {
  maxRetriesPerRequest: null,
  lazyConnect: true,
};

// Options for pub/sub clients (Socket.IO adapter) - must connect immediately
const pubSubClientOptions = {
  maxRetriesPerRequest: null,
  // No lazyConnect - Socket.IO adapter needs immediate connection
  // No enableOfflineQueue: false - adapter needs to queue subscribe commands
};

let redis: Redis;
let pubClient: Redis;
let subClient: Redis;

if (redisUrl) {
  // Upstash uses rediss:// (TLS) - ioredis handles this automatically
  redis = new Redis(redisUrl, cacheClientOptions);
  pubClient = new Redis(redisUrl, pubSubClientOptions);
  subClient = new Redis(redisUrl, pubSubClientOptions);
} else if (isRedisConfigured) {
  const baseConfig = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  };
  redis = new Redis({ ...baseConfig, ...cacheClientOptions });
  pubClient = new Redis({ ...baseConfig, ...pubSubClientOptions });
  subClient = new Redis({ ...baseConfig, ...pubSubClientOptions });
} else {
  // Dummy clients for when Redis is not configured (localhost dev)
  redis = new Redis({
    lazyConnect: true,
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
  });
  pubClient = new Redis({ lazyConnect: true });
  subClient = new Redis({ lazyConnect: true });
  console.log("Redis not configured - running in single-instance mode");
}

// Graceful error handling - don't crash
redis.on("error", (err) => console.warn("Redis Error:", err.message));
pubClient.on("error", (err) => console.warn("Redis Pub Error:", err.message));
subClient.on("error", (err) => console.warn("Redis Sub Error:", err.message));

// Track connection status
export let redisAvailable = false;

// Connect the main cache client lazily
if (isRedisConfigured && redis.options.lazyConnect) {
  redis
    .connect()
    .then(() => {
      redisAvailable = true;
      console.log("Redis cache client connected");
    })
    .catch((err) => {
      console.warn("Redis connection failed:", err.message);
    });
}

export { redis, pubClient, subClient };
