/**
 * Build prompt to transform raw clinical notes into JSON.
 * @param {{ rawNotes: string }} params
 * @returns {string}
 */
export function buildNotesPrompt({ rawNotes }) {
	return `Convert the following raw doctor notes into structured JSON.

Raw notes:
${rawNotes}

Respond ONLY with valid JSON (no markdown, no explanation) using:
{
	"diagnosis": string,
	"medications": string[],
	"followUp": string,
	"vitals": {
		"bp": string|null,
		"pulse": string|null,
		"temperature": string|null,
		"spo2": string|null
	}
}`;
}

