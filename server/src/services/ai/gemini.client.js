import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from "../../config/env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

/**
 * Get a Gemini model instance.
 * @param {string} [modelName]
 * @returns {import("@google/generative-ai").GenerativeModel}
 */
export function getModel(modelName = env.GEMINI_MODEL || "gemini-1.5-flash") {
	return genAI.getGenerativeModel({ model: modelName });
}

