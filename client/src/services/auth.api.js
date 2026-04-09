import { api } from "./api.js";

/**
 * Login with email/password.
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<any>}
 */
export async function login(payload) {
	const response = await api.post("/auth/login", payload);
	return response.data?.data;
}

/**
 * Refresh access token using refresh cookie.
 * @returns {Promise<any>}
 */
export async function refresh() {
	const response = await api.post("/auth/refresh", {});
	return response.data?.data;
}

/**
 * Logout current session.
 * @returns {Promise<void>}
 */
export async function logout() {
	await api.post("/auth/logout", {});
}

