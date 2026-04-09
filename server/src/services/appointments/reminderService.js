import { APPOINTMENT_STATUS } from "shared/constants/appointmentStatus.js";

import { Appointment } from "../../models/Appointment.model.js";
import { Patient } from "../../models/Patient.model.js";
import { sendTelegramMessage } from "../telegram/messageSender.js";

/**
 * Send reminders for appointments 23-25 hours in the future.
 * @returns {Promise<number>}
 */
export async function sendUpcomingReminders() {
	const now = new Date();
	const from = new Date(now.getTime() + 23 * 60 * 60 * 1000);
	const to = new Date(now.getTime() + 25 * 60 * 60 * 1000);

	const appointments = await Appointment.find({
		date: { $gte: from, $lte: to },
		status: APPOINTMENT_STATUS.BOOKED,
		reminderSent: false,
	}).populate("doctorId", "name");

	for (const appointment of appointments) {
		const patient = await Patient.findById(appointment.patientId).select("telegramChatId telegramOptIn");
		if (!patient?.telegramChatId || patient.telegramOptIn === false) continue;

		await sendTelegramMessage(
			patient.telegramChatId,
			`Reminder: You have an appointment on ${appointment.date.toDateString()} at ${appointment.slotTime}.`,
		);

		appointment.reminderSent = true;
		await appointment.save();
	}

	return appointments.length;
}

