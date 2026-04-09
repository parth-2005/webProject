import cron from "node-cron";

import { sendUpcomingReminders } from "../services/appointments/reminderService.js";

/**
 * Register reminder cron job (every 30 minutes).
 * @returns {import("node-cron").ScheduledTask}
 */
export function registerReminderJob() {
	return cron.schedule("*/30 * * * *", async () => {
		try {
			await sendUpcomingReminders();
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error("Reminder job failed:", err?.message ?? err);
		}
	});
}

