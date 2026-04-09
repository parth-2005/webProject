/**
 * Build intent classification prompt.
 * @param {{ message: string }} params
 * @returns {string}
 */
export function buildIntentPrompt({ message }) {
	return `You are an intent classifier for a hospital assistant.
Classify the user message into exactly one of: booking, triage, faq, greeting, unknown.

User message: "${message}"

Respond ONLY with valid JSON. No markdown, no explanation.
Schema: { "intent": "booking|triage|faq|greeting|unknown", "confidence": 0.0 }`;
}

