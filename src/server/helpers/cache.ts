import { redis } from "../config/redis.ts";

/**
 * Generic Cache Helper for the Cache-Aside pattern.
 * Tries to get data from Redis, if not found, fetches from DB and stores it.
 */
export async function getOrSet<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 300, // Default 5 minutes
): Promise<T> {
  try {
    const cachedData = await redis.get(key);

    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }

    // Cache miss - fetch from DB
    const freshData = await fetchFn();

    // Store in Redis (background - don't block response)
    if (freshData !== undefined && freshData !== null) {
      await redis.set(key, JSON.stringify(freshData), "EX", ttlSeconds);
    }

    return freshData;
  } catch (error) {
    console.error(`Cache Error for key ${key}:`, error);
    // On cache error, fall back to DB fetch directly to avoid breaking the app
    return fetchFn();
  }
}

/**
 * Invalidate a specific cache key
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Cache Invalidation Error for key ${key}:`, error);
  }
}

/**
 * Invalidate multiple cache keys using a pattern
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error(`Cache Pattern Invalidation Error for ${pattern}:`, error);
  }
}
