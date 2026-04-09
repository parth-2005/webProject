/**
 * Build FAQ prompt with hospital context.
 * @param {{ hospitalName: string, hospitalPhone: string, message: string }} params
 * @returns {string}
 */
export function buildFaqPrompt({ hospitalName, hospitalPhone, message }) {
	return `You are a hospital FAQ assistant for ${hospitalName}.
Hospital contact number: ${hospitalPhone}
Answer briefly and clearly. If unsure, ask the user to contact the hospital number.

User question: "${message}"`;
}

