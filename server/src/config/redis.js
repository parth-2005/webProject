import Redis from "ioredis";

import { env } from "./env.js";

let redisClient = null;

/**
 * Get a singleton Redis client.
 * @returns {import("ioredis").Redis}
 */
export function getRedis() {
  if (redisClient) return redisClient;

  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });

  redisClient.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("Redis error:", err?.message ?? err);
  });

  return redisClient;
}


