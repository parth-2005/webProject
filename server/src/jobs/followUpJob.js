import cron from "node-cron";

import { sendPostVisitFollowUps } from "../services/notifications/followUpService.js";

/**
 * Register follow-up cron job (every hour).
 * @returns {import("node-cron").ScheduledTask}
 */
export function registerFollowUpJob() {
	return cron.schedule("0 * * * *", async () => {
		try {
			await sendPostVisitFollowUps();
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error("Follow-up job failed:", err?.message ?? err);
		}
	});
}

