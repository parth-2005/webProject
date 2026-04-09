/**
 * Build booking extraction prompt.
 * @param {{ message: string }} params
 * @returns {string}
 */
export function buildBookingExtractionPrompt({ message }) {
	return `Extract booking details from this hospital appointment request.
User message: "${message}"

Return ONLY valid JSON with this schema:
{
	"doctorName": string|null,
	"specialization": string|null,
	"preferredDate": string|null
}

preferredDate must be in YYYY-MM-DD if inferable, else null.
No markdown. No explanation.`;
}

