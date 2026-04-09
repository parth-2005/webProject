import { env } from "../../config/env.js";

/**
 * Build Telegram Bot API URL.
 * @param {string} method
 * @returns {string}
 */
function buildTelegramUrl(method) {
  const base = env.TELEGRAM_API_BASE.replace(/\/+$/, "");
  return `${base}/bot${env.TELEGRAM_BOT_TOKEN}/${method}`;
}

/**
 * Send plain text Telegram message.
 * @param {string|number} chatId
 * @param {string} text
 * @returns {Promise<void>}
 */
export async function sendTelegramMessage(chatId, text) {
  const response = await fetch(buildTelegramUrl("sendMessage"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram sendMessage failed with status ${response.status}: ${body}`);
  }
}

/**
 * Send a numbered list over Telegram.
 * @param {string|number} chatId
 * @param {string[]} items
 * @returns {Promise<void>}
 */
export async function sendTelegramList(chatId, items) {
  const body = items.map((item, index) => `${index + 1}. ${item}`).join("\n");
  await sendTelegramMessage(chatId, body);
}
