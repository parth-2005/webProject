import { z } from "zod";

import { processIncomingMessage, processNotesFormatting } from "../services/ai/aiService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { validateBody } from "../middleware/validate.middleware.js";

const processMessageSchema = z.object({
	phone: z.string().min(1),
	message: z.string().min(1),
});

const formatNotesSchema = z.object({
	rawNotes: z.string().min(1),
});

/**
 * Validation middleware for process-message payload.
 */
export const validateProcessMessageBody = validateBody(processMessageSchema);

/**
 * Validation middleware for format-notes payload.
 */
export const validateFormatNotesBody = validateBody(formatNotesSchema);

/**
 * POST /api/ai/process-message
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const processMessage = asyncHandler(async (req, res) => {
	const data = await processIncomingMessage(req.body);
	res.status(200).json(
		new ApiResponse({ success: true, statusCode: 200, data, message: "Message processed successfully" }),
	);
});

/**
 * POST /api/ai/format-notes
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const formatNotes = asyncHandler(async (req, res) => {
	const data = await processNotesFormatting(req.body);
	res.status(200).json(
		new ApiResponse({ success: true, statusCode: 200, data, message: "Notes formatted successfully" }),
	);
});

