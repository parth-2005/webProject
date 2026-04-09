import { getSocket } from "./baileys.client.js";

/**
 * Normalize phone to WhatsApp JID.
 * @param {string} phone
 * @returns {string}
 */
function toJid(phone) {
	return phone.includes("@s.whatsapp.net") ? phone : `${phone}@s.whatsapp.net`;
}

/**
 * Send plain text WhatsApp message.
 * @param {string} phone
 * @param {string} text
 * @returns {Promise<void>}
 */
export async function send(phone, text) {
	const sock = getSocket();
	if (!sock) return;
	await sock.sendMessage(toJid(phone), { text });
}

/**
 * Send list-like response as numbered text.
 * @param {string} phone
 * @param {string[]} items
 * @returns {Promise<void>}
 */
export async function sendList(phone, items) {
	const body = items.map((item, idx) => `${idx + 1}. ${item}`).join("\n");
	await send(phone, body);
}

