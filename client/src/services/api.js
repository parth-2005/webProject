import axios from "axios";

import { useAuthStore } from "../store/authStore.js";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Shared Axios client for backend APIs.
 */
export const api = axios.create({
	baseURL,
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
				const accessToken = refreshResponse.data?.data?.accessToken;
				if (!accessToken) throw new Error("Missing refreshed token");

				const { user, setAuth } = useAuthStore.getState();
				setAuth({ user, token: accessToken });
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch {
				useAuthStore.getState().logout();
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	},
);

