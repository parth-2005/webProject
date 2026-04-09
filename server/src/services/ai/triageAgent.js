import { env } from "../../config/env.js";
import { getModel } from "./gemini.client.js";
import { buildTriageSystemPrompt } from "./prompts/triage.prompt.js";

const DISCLAIMER = "⚠️ This is general guidance only, not a medical diagnosis.";

/**
 * Continue triage chat flow using Gemini multi-turn startChat.
 * @param {{ history: Array<{ role: "user"|"model", content: string }>, message: string }} params
 * @returns {Promise<{ responseText: string, newState: "triage", contextUpdate: Record<string, any> }>}
 */
export async function runTriageAgent({ history, message }) {
	const model = getModel();
	const chat = model.startChat({
		history: history.map((item) => ({ role: item.role, parts: [{ text: item.content }] })),
		generationConfig: { maxOutputTokens: 512 },
		systemInstruction: buildTriageSystemPrompt({ hospitalName: env.HOSPITAL_NAME }),
	});

	const result = await chat.sendMessage(message);
	let responseText = result.response.text().trim();
	if (!responseText.endsWith(DISCLAIMER)) {
		responseText = `${responseText}\n\n${DISCLAIMER}`;
	}

	return { responseText, newState: "triage", contextUpdate: {} };
}

