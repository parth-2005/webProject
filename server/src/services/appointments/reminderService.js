import { APPOINTMENT_STATUS } from "shared/constants/appointmentStatus.js";

import { Appointment } from "../../models/Appointment.model.js";
import { Patient } from "../../models/Patient.model.js";
import { send } from "../whatsapp/messageSender.js";

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
		const patient = await Patient.findById(appointment.patientId).select("phone name");
		if (!patient?.phone) continue;

		await send(
			patient.phone,
			`Reminder: You have an appointment on ${appointment.date.toDateString()} at ${appointment.slotTime}.`,
		);

		appointment.reminderSent = true;
		await appointment.save();
	}

	return appointments.length;
}

