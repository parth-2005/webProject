import { getModel } from "./gemini.client.js";
import { buildIntentPrompt } from "./prompts/intent.prompt.js";

const VALID_INTENTS = new Set(["booking", "triage", "faq", "greeting", "unknown"]);

/**
 * Classify user intent from message text.
 * @param {string} message
 * @returns {Promise<"booking"|"triage"|"faq"|"greeting"|"unknown">}
 */
export async function detectIntent(message) {
	const model = getModel();
	const result = await model.generateContent(buildIntentPrompt({ message }));
	const raw = result.response.text();

	try {
		const cleaned = raw.replace(/```json|```/g, "").trim();
		const parsed = JSON.parse(cleaned);
		const intent = typeof parsed.intent === "string" ? parsed.intent.toLowerCase() : "unknown";
		return VALID_INTENTS.has(intent) ? intent : "unknown";
	} catch {
		return "unknown";
	}
}

