import { useAuthStore } from "../store/authStore.js";

/**
 * Hook exposing auth state and actions.
 * @returns {{ user: any, token: string|null, role: string|null, setAuth: Function, logout: Function }}
 */
export function useAuth() {
	const user = useAuthStore((state) => state.user);
	const token = useAuthStore((state) => state.token);
	const role = useAuthStore((state) => state.role);
	const setAuth = useAuthStore((state) => state.setAuth);
	const logout = useAuthStore((state) => state.logout);

	return { user, token, role, setAuth, logout };
}

