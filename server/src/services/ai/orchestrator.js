import { createAppointmentRecord } from "../appointments/appointmentService.js";
import { runBookingAgent } from "./bookingAgent.js";
import { runFaqAgent } from "./faqAgent.js";
import { detectIntent } from "./intentAgent.js";
import { runTriageAgent } from "./triageAgent.js";

/**
 * Route a conversation turn to the correct AI agent based on state.
 * @param {{ message: string, conversation: { state: string, context: Record<string, any>, history: Array<{ role: "user"|"model", content: string }> } }} params
 * @returns {Promise<{ responseText: string, newState: string, contextUpdate: Record<string, any>, appointmentData?: any }>}
 */
export async function orchestrateMessage({ message, conversation }) {
	const state = conversation.state || "idle";
	const context = conversation.context || {};

	if (state === "awaiting_confirm") {
		const normalized = message.trim().toLowerCase();
		if (["yes", "y", "confirm", "ok"].includes(normalized)) {
			const appointmentData = context.pendingAppointment;
			if (appointmentData) {
				const appointment = await createAppointmentRecord(appointmentData);
				return {
					responseText: "Your appointment has been booked successfully.",
					newState: "idle",
					contextUpdate: {},
					appointmentData: appointment,
				};
			}
			return {
				responseText: "I could not find pending booking data. Please start booking again.",
				newState: "idle",
				contextUpdate: {},
			};
		}

		if (["no", "n", "cancel"].includes(normalized)) {
			return {
				responseText: "Booking cancelled. You can start again anytime.",
				newState: "idle",
				contextUpdate: {},
			};
		}

		return {
			responseText: "Please reply with yes to confirm or no to cancel.",
			newState: "awaiting_confirm",
			contextUpdate: context,
		};
	}

	if (state === "booking" && context.awaitingSlotSelection) {
		const picked = Number.parseInt(message, 10);
		if (!Number.isNaN(picked) && context.availableSlots?.[picked - 1]) {
			const selectedSlot = context.availableSlots[picked - 1];
			const pendingAppointment = {
				doctorId: context.doctorId,
				date: context.preferredDate,
				slotTime: selectedSlot.start,
				bookedVia: "telegram",
				patientId: context.patientId || null,
				status: "booked",
			};

			return {
				responseText: `Please confirm booking for ${context.preferredDate} at ${selectedSlot.start}. Reply yes or no.`,
				newState: "awaiting_confirm",
				contextUpdate: { ...context, pendingAppointment, awaitingSlotSelection: false },
			};
		}

		return {
			responseText: "Please reply with a valid slot number from the list.",
			newState: "booking",
			contextUpdate: context,
		};
	}

	if (state === "triage") {
		return runTriageAgent({ history: conversation.history || [], message });
	}

	if (state === "booking") {
		return runBookingAgent({ message, context });
	}

	const intent = await detectIntent(message);
	if (intent === "triage") {
		return runTriageAgent({ history: conversation.history || [], message });
	}
	if (intent === "booking") {
		return runBookingAgent({ message, context });
	}
	if (intent === "faq" || intent === "greeting") {
		return runFaqAgent(message);
	}

	return {
		responseText: "I can help with appointment booking, triage guidance, and hospital FAQs. How can I help?",
		newState: "idle",
		contextUpdate: {},
	};
}

