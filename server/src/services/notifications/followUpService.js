import { APPOINTMENT_STATUS } from "shared/constants/appointmentStatus.js";

import { Appointment } from "../../models/Appointment.model.js";
import { Patient } from "../../models/Patient.model.js";
import { sendTelegramMessage } from "../telegram/messageSender.js";

/**
 * Send follow-up messages for appointments completed 23-25 hours ago.
 * @returns {Promise<number>}
 */
export async function sendPostVisitFollowUps() {
	const now = new Date();
	const from = new Date(now.getTime() - 25 * 60 * 60 * 1000);
	const to = new Date(now.getTime() - 23 * 60 * 60 * 1000);

	const appointments = await Appointment.find({
		date: { $gte: from, $lte: to },
		status: APPOINTMENT_STATUS.COMPLETED,
		followUpSent: false,
	});

	for (const appointment of appointments) {
		const patient = await Patient.findById(appointment.patientId).select("telegramChatId telegramOptIn");
		if (!patient?.telegramChatId || patient.telegramOptIn === false) continue;

		await sendTelegramMessage(
			patient.telegramChatId,
			"We hope you are feeling better. Reply to this message if you would like a follow-up appointment.",
		);

		appointment.followUpSent = true;
		await appointment.save();
	}

	return appointments.length;
}

