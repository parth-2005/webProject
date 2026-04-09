import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";

import { registerMessageHandler } from "./messageHandler.js";
import { useRedisAuthState } from "./sessionStore.js";

let socket = null;
let reconnectAttempts = 0;

/**
 * Return current active WhatsApp socket.
 * @returns {any}
 */
export function getSocket() {
	return socket;
}

/**
 * Initialize Baileys client and register lifecycle listeners.
 * @returns {Promise<any>}
 */
export async function initBaileys() {
	const { state, saveCreds } = await useRedisAuthState();
	const { version } = await fetchLatestBaileysVersion();

	socket = makeWASocket({
		version,
		auth: state,
		printQRInTerminal: true,
		markOnlineOnConnect: false,
	});

	socket.ev.on("creds.update", saveCreds);
	registerMessageHandler(socket);

	socket.ev.on("connection.update", async (update) => {
		const { connection, lastDisconnect } = update;

		if (connection === "open") {
			reconnectAttempts = 0;
			return;
		}

		if (connection === "close") {
			const statusCode = lastDisconnect?.error?.output?.statusCode;
			const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

			if (shouldReconnect) {
				reconnectAttempts += 1;
				const delay = Math.min(30000, 1000 * 2 ** reconnectAttempts);
				setTimeout(() => {
					initBaileys().catch((err) => {
						// eslint-disable-next-line no-console
						console.error("Baileys reconnect failed:", err?.message ?? err);
					});
				}, delay);
			}
		}
	});

	return socket;
}

