import mongoose from "mongoose";

import { env } from "./env.js";

/**
 * Connect to MongoDB with retry logic.
 * @param {object} [options]
 * @param {number} [options.maxRetries]
 * @param {number} [options.retryDelayMs]
 * @returns {Promise<mongoose.Mongoose>}
 */
export async function connectDb(
  options = { maxRetries: 10, retryDelayMs: 1500 },
) {
  const { maxRetries, retryDelayMs } = options;

  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      return await mongoose.connect(env.MONGO_URI);
    } catch (err) {
      lastError = err;
      // eslint-disable-next-line no-console
      console.error(
        `MongoDB connection failed (attempt ${attempt}/${maxRetries}).`,
        err?.message ?? err,
      );
      await new Promise((r) => setTimeout(r, retryDelayMs));
    }
  }

  throw lastError;
}

