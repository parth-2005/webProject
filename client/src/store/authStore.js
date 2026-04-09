import { create } from "zustand";

/**
 * Auth store for user/session state.
 */
export const useAuthStore = create((set) => ({
	user: null,
	token: null,
	role: null,
	setAuth: ({ user, token }) => set({ user, token, role: user?.role || null }),
	logout: () => set({ user: null, token: null, role: null }),
}));

