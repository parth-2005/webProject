import { getRedis } from "../../config/redis.js";
import { processIncomingMessage } from "../ai/aiService.js";
import { send } from "./messageSender.js";

const DEDUPE_TTL_SECONDS = 600;

/**
 * Extract text body from a Baileys message payload.
 * @param {any} message
 * @returns {string}
 */
function getTextFromMessage(message) {
	return (
		message?.conversation
		|| message?.extendedTextMessage?.text
		|| message?.imageMessage?.caption
		|| ""
	).trim();
}

/**
 * Register message listener on a socket.
 * @param {any} socket
 */
export function registerMessageHandler(socket) {
	socket.ev.on("messages.upsert", async (event) => {
		if (event.type !== "notify") return;

		for (const item of event.messages || []) {
			const messageId = item.key?.id;
			const remoteJid = item.key?.remoteJid;
			const fromMe = item.key?.fromMe;

			if (!messageId || !remoteJid || fromMe) continue;
			if (!remoteJid.endsWith("@s.whatsapp.net")) continue;

			const redis = getRedis();
			const dedupeKey = `wa:msg:dedupe:${messageId}`;
			const alreadyProcessed = await redis.get(dedupeKey);
			if (alreadyProcessed) continue;
			await redis.set(dedupeKey, "1", "EX", DEDUPE_TTL_SECONDS);

			const text = getTextFromMessage(item.message);
			if (!text) continue;

			const phone = remoteJid.replace("@s.whatsapp.net", "");
			const response = await processIncomingMessage({ phone, message: text });
			await send(phone, response.responseText);
		}
	});
}

