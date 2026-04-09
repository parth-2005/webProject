import { z } from "zod";

import { processIncomingMessage } from "../services/ai/aiService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { validateBody } from "../middleware/validate.middleware.js";

const whatsappWebhookSchema = z.object({
	phone: z.string().min(1),
	message: z.string().min(1),
});

/**
 * Validation middleware for webhook payload.
 */
export const validateWhatsappWebhookBody = validateBody(whatsappWebhookSchema);

/**
 * POST /api/webhook/whatsapp
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const receiveWhatsappWebhook = asyncHandler(async (req, res) => {
	const data = await processIncomingMessage(req.body);
	res.status(200).json(
		new ApiResponse({ success: true, statusCode: 200, data, message: "Webhook processed successfully" }),
	);
});

