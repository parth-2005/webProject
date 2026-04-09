import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { getRedis } from "./config/redis.js";
import { createApp } from "./app.js";
import { registerReminderJob } from "./jobs/reminderJob.js";
import { registerFollowUpJob } from "./jobs/followUpJob.js";
import { startTelegramBot } from "./services/telegram/telegram.client.js";

/**
 * Start the HTTP server after connecting dependencies.
 * @returns {Promise<import("http").Server>}
 */
export async function startServer() {
  await connectDb();
  getRedis();

  const app = createApp();
  return new Promise((resolve) => {
    const server = app.listen(env.PORT, () => {
      registerReminderJob();
      registerFollowUpJob();
      startTelegramBot();

      // eslint-disable-next-line no-console
      console.log(`Server listening on port ${env.PORT}`);
      resolve(server);
    });
  });
}

