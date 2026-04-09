import { ROLES } from "shared/constants/roles.js";

import { User } from "../../models/User.model.js";
import { resolveSlots } from "../appointments/slotResolver.js";
import { getModel } from "./gemini.client.js";
import { buildBookingExtractionPrompt } from "./prompts/booking.prompt.js";

/**
 * Extract structured booking details from natural language.
 * @param {string} message
 * @returns {Promise<{ doctorName: string|null, specialization: string|null, preferredDate: string|null }>}
 */
async function extractBookingDetails(message) {
	const model = getModel();
	const result = await model.generateContent(buildBookingExtractionPrompt({ message }));
	const raw = result.response.text();

	try {
		const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
		return {
			doctorName: parsed.doctorName || null,
			specialization: parsed.specialization || null,
			preferredDate: parsed.preferredDate || null,
		};
	} catch {
		return { doctorName: null, specialization: null, preferredDate: null };
	}
}

/**
 * Run booking extraction and slot resolution flow.
 * @param {{ message: string, context: Record<string, any> }} params
 * @returns {Promise<{ responseText: string, newState: "booking", contextUpdate: Record<string, any> }>}
 */
export async function runBookingAgent({ message, context }) {
	const extracted = await extractBookingDetails(message);
	const preferredDate = extracted.preferredDate || context.preferredDate || null;

	const doctorQuery = { role: ROLES.DOCTOR, isActive: true };
	if (extracted.doctorName) {
		doctorQuery.name = { $regex: extracted.doctorName, $options: "i" };
	}
	if (extracted.specialization) {
		doctorQuery["doctorProfile.specialization"] = { $regex: extracted.specialization, $options: "i" };
	}

	const doctor = await User.findOne(doctorQuery).select("name doctorProfile");
	if (!doctor) {
		return {
			responseText: "I could not find a matching doctor. Please share doctor name or specialization.",
			newState: "booking",
			contextUpdate: { ...context, ...extracted },
		};
	}

	if (!preferredDate) {
		return {
			responseText: `Please share your preferred date for Dr. ${doctor.name} in YYYY-MM-DD format.`,
			newState: "booking",
			contextUpdate: { ...context, ...extracted, doctorId: String(doctor._id), doctorName: doctor.name },
		};
	}

	const slots = await resolveSlots(String(doctor._id), preferredDate);
	if (slots.length === 0) {
		return {
			responseText: `No slots are available for Dr. ${doctor.name} on ${preferredDate}. Please pick another date.`,
			newState: "booking",
			contextUpdate: {
				...context,
				...extracted,
				doctorId: String(doctor._id),
				doctorName: doctor.name,
				preferredDate,
			},
		};
	}

	const slotLines = slots.slice(0, 8).map((slot, index) => `${index + 1}. ${slot.start}`).join("\n");
	return {
		responseText: `Available slots for Dr. ${doctor.name} on ${preferredDate}:\n${slotLines}\nReply with the slot number to continue.`,
		newState: "booking",
		contextUpdate: {
			...context,
			doctorId: String(doctor._id),
			doctorName: doctor.name,
			preferredDate,
			availableSlots: slots,
			awaitingSlotSelection: true,
		},
	};
}

