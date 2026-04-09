import { BufferJSON, initAuthCreds, proto } from "@whiskeysockets/baileys";

import { getRedis } from "../../config/redis.js";

const CREDS_KEY = "wa:auth:creds";

/**
 * Build a Redis-backed auth state compatible with Baileys.
 * @returns {Promise<{ state: any, saveCreds: () => Promise<void> }>}
 */
export async function useRedisAuthState() {
	const redis = getRedis();
	const rawCreds = await redis.get(CREDS_KEY);
	const creds = rawCreds ? JSON.parse(rawCreds, BufferJSON.reviver) : initAuthCreds();

	const state = {
		creds,
		keys: {
			/**
			 * @param {string} type
			 * @param {string[]} ids
			 * @returns {Promise<Record<string, any>>}
			 */
			get: async (type, ids) => {
				const data = {};
				for (const id of ids) {
					const value = await redis.get(`wa:auth:key:${type}:${id}`);
					if (!value) continue;
					let parsed = JSON.parse(value, BufferJSON.reviver);
					if (type === "app-state-sync-key") {
						parsed = proto.Message.AppStateSyncKeyData.fromObject(parsed);
					}
					data[id] = parsed;
				}
				return data;
			},
			/**
			 * @param {Record<string, Record<string, any>>} data
			 * @returns {Promise<void>}
			 */
			set: async (data) => {
				const operations = [];
				for (const [type, entries] of Object.entries(data)) {
					for (const [id, value] of Object.entries(entries)) {
						const key = `wa:auth:key:${type}:${id}`;
						if (value) {
							operations.push(redis.set(key, JSON.stringify(value, BufferJSON.replacer)));
						} else {
							operations.push(redis.del(key));
						}
					}
				}
				await Promise.all(operations);
			},
		},
	};

	/**
	 * Persist credentials to Redis.
	 * @returns {Promise<void>}
	 */
	const saveCreds = async () => {
		await redis.set(CREDS_KEY, JSON.stringify(state.creds, BufferJSON.replacer));
	};

	return { state, saveCreds };
}

