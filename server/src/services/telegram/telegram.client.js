import { env } from "../../config/env.js";
import { getRedis } from "../../config/redis.js";
import { processIncomingMessage } from "../ai/aiService.js";
import { sendTelegramMessage } from "./messageSender.js";

const POLL_TIMEOUT_SECONDS = 30;
const RETRY_DELAY_MS = 2000;
const OFFSET_KEY = "telegram:bot:updateOffset";

let isPolling = false;

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
 * Read last processed Telegram update offset from Redis.
 * @returns {Promise<number>}
 */
async function getOffset() {
  const redis = getRedis();
  const value = await redis.get(OFFSET_KEY);
  const parsed = Number.parseInt(value || "0", 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Persist next Telegram update offset.
 * @param {number} offset
 * @returns {Promise<void>}
 */
async function setOffset(offset) {
  const redis = getRedis();
  await redis.set(OFFSET_KEY, String(offset));
}

/**
 * Handle one inbound Telegram update.
 * @param {any} update
 * @returns {Promise<void>}
 */
async function handleUpdate(update) {
  const text = update?.message?.text?.trim();
  const chatId = update?.message?.chat?.id;
  if (!text || chatId === undefined || chatId === null) return;

  const conversationId = `telegram:${chatId}`;
  const response = await processIncomingMessage({ phone: conversationId, message: text });
  await sendTelegramMessage(chatId, response.responseText);
}

/**
 * Poll Telegram Bot API updates in a background loop.
 * @returns {Promise<void>}
 */
async function pollLoop() {
  while (isPolling) {
    try {
      const offset = await getOffset();
      const query = new URLSearchParams({
        timeout: String(POLL_TIMEOUT_SECONDS),
        offset: String(offset),
        allowed_updates: JSON.stringify(["message"]),
      });

      const response = await fetch(`${buildTelegramUrl("getUpdates")}?${query.toString()}`);
      if (!response.ok) {
        throw new Error(`Telegram getUpdates failed with status ${response.status}`);
      }

      const payload = await response.json();
      if (!payload?.ok || !Array.isArray(payload?.result)) {
        throw new Error("Telegram getUpdates response is invalid");
      }

      for (const update of payload.result) {
        await handleUpdate(update);
        if (typeof update?.update_id === "number") {
          await setOffset(update.update_id + 1);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Telegram polling error:", err?.message ?? err);
      await new Promise((resolve) => {
        setTimeout(resolve, RETRY_DELAY_MS);
      });
    }
  }
}

/**
 * Start Telegram polling once per process.
 */
export function startTelegramBot() {
  if (isPolling) return;
  if (env.TELEGRAM_BOT_TOKEN.startsWith("replace_with_")) {
    // eslint-disable-next-line no-console
    console.warn("Telegram bot not started: set TELEGRAM_BOT_TOKEN to a real token.");
    return;
  }

  isPolling = true;
  fetch(buildTelegramUrl("getMe"))
    .then(async (response) => {
      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Telegram getMe failed with status ${response.status}: ${body}`);
      }
      return pollLoop();
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error("Telegram bot not started:", err?.message ?? err);
      isPolling = false;
    });
}
