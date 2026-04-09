import { getModel } from "./gemini.client.js";
import { buildNotesPrompt } from "./prompts/notes.prompt.js";

/**
 * Convert raw doctor notes to structured JSON.
 * @param {string} rawNotes
 * @returns {Promise<{ diagnosis: string, medications: string[], followUp: string, vitals: Record<string, string|null> }>}
 */
export async function formatDoctorNotes(rawNotes) {
	const model = getModel();
	const result = await model.generateContent(buildNotesPrompt({ rawNotes }));
	const raw = result.response.text();

	try {
		return JSON.parse(raw.replace(/```json|```/g, "").trim());
	} catch {
		return {
			diagnosis: "",
			medications: [],
			followUp: "",
			vitals: { bp: null, pulse: null, temperature: null, spo2: null },
		};
	}
}

