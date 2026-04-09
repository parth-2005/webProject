import { env } from "../../config/env.js";
import { getModel } from "./gemini.client.js";
import { buildFaqPrompt } from "./prompts/faq.prompt.js";

/**
 * Generate FAQ response for a user question.
 * @param {string} message
 * @returns {Promise<{ responseText: string, newState: "idle", contextUpdate: Record<string, any> }>}
 */
export async function runFaqAgent(message) {
	const model = getModel();
	const result = await model.generateContent(
		buildFaqPrompt({
			hospitalName: env.HOSPITAL_NAME,
			hospitalPhone: env.HOSPITAL_PHONE,
			message,
		}),
	);

	return {
		responseText: result.response.text().trim(),
		newState: "idle",
		contextUpdate: {},
	};
}

