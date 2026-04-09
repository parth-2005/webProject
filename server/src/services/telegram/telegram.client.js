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
 * Register Telegram webhook endpoint with Telegram Bot API.
 * @returns {Promise<void>}
 */
export async function ensureTelegramWebhook() {
  if (!env.TELEGRAM_WEBHOOK_URL) {
    // eslint-disable-next-line no-console
    console.warn("Telegram webhook not configured: set TELEGRAM_WEBHOOK_URL to enable webhook mode.");
    return;
  }

  const payload = {
    url: env.TELEGRAM_WEBHOOK_URL,
  };

  if (env.TELEGRAM_WEBHOOK_SECRET) {
    payload.secret_token = env.TELEGRAM_WEBHOOK_SECRET;
  }

  const response = await fetch(buildTelegramUrl("setWebhook"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram setWebhook failed with status ${response.status}: ${body}`);
  }

  const data = await response.json();
  if (!data?.ok) {
    throw new Error(`Telegram setWebhook failed: ${data?.description || "Unknown error"}`);
  }
}
