import { z } from "zod";

import { processIncomingMessage } from "../services/ai/aiService.js";
import { sendTelegramMessage } from "../services/telegram/messageSender.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { validateBody } from "../middleware/validate.middleware.js";

const telegramWebhookSchema = z.object({
	chatId: z.union([z.string(), z.number()]).optional(),
	phone: z.string().min(1).optional(),
	message: z.string().min(1),
});

/**
 * Validation middleware for Telegram webhook payload.
 */
export const validateTelegramWebhookBody = validateBody(telegramWebhookSchema);

/**
 * POST /api/webhook/telegram
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const receiveTelegramWebhook = asyncHandler(async (req, res) => {
	const { chatId, phone, message } = req.body;
	const conversationId = phone || `telegram:${chatId}`;

	const data = await processIncomingMessage({ phone: conversationId, message });

	if (typeof chatId !== "undefined") {
		await sendTelegramMessage(chatId, data.responseText);
	}

	res.status(200).json(
		new ApiResponse({ success: true, statusCode: 200, data, message: "Telegram webhook processed successfully" }),
	);
});

