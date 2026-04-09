import { z } from "zod";

import { env } from "../config/env.js";
import { processIncomingMessage } from "../services/ai/aiService.js";
import { sendTelegramMessage } from "../services/telegram/messageSender.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const telegramWebhookSchema = z.union([
	z.object({
		update_id: z.number().optional(),
		message: z.object({
			text: z.string().optional(),
			chat: z.object({
				id: z.union([z.string(), z.number()]),
			}),
		}).passthrough().optional(),
	}).passthrough(),
	z.object({
		chatId: z.union([z.string(), z.number()]).optional(),
		phone: z.string().min(1).optional(),
		message: z.string().min(1),
	}),
]);

/**
 * Validate Telegram webhook secret if configured.
 */
export function validateTelegramWebhookSecret(req, res, next) {
	if (!env.TELEGRAM_WEBHOOK_SECRET) {
		next();
		return;
	}

	const secret = req.header("x-telegram-bot-api-secret-token");
	if (secret !== env.TELEGRAM_WEBHOOK_SECRET) {
		next(new ApiError(401, "Invalid Telegram webhook secret"));
		return;
	}

	next();
}

/**
 * POST /api/webhook/telegram
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const receiveTelegramWebhook = asyncHandler(async (req, res) => {
	const parsed = telegramWebhookSchema.safeParse(req.body);
	if (!parsed.success) {
		throw new ApiError(400, "Invalid Telegram webhook payload");
	}

	const body = parsed.data;
	const nativeChatId = body?.message?.chat?.id;
	const nativeMessageText = body?.message?.text?.trim();

	const chatId = nativeChatId ?? body?.chatId;
	const messageText = nativeMessageText ?? (typeof body?.message === "string" ? body.message.trim() : "");

	if (!chatId || !messageText) {
		res.status(200).json(
			new ApiResponse({ success: true, statusCode: 200, data: null, message: "Telegram update ignored" }),
		);
		return;
	}

	const conversationId = body?.phone || `telegram:${chatId}`;
	const data = await processIncomingMessage({ phone: conversationId, message: messageText });
	await sendTelegramMessage(chatId, data.responseText);

	res.status(200).json(
		new ApiResponse({ success: true, statusCode: 200, data, message: "Telegram webhook processed successfully" }),
	);
});

