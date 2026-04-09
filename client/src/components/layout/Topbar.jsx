import { useNavigate } from "react-router-dom";

import { logout as logoutApi } from "../../services/auth.api.js";
import { useAuthStore } from "../../store/authStore.js";
import { useUiStore } from "../../store/uiStore.js";

/**
 * Topbar with user meta, sidebar toggle and logout.
 * @returns {JSX.Element}
 */
export default function Topbar() {
	const navigate = useNavigate();
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const toggleSidebar = useUiStore((state) => state.toggleSidebar);

	const handleLogout = async () => {
		try {
			await logoutApi();
		} finally {
			logout();
			navigate("/login");
		}
	};

	return (
		<header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
			<div className="flex items-center justify-between px-4 md:px-6 h-14">
				<button type="button" className="rounded-md border border-slate-300 px-3 py-1 text-sm" onClick={toggleSidebar}>
					Menu
				</button>
				<div className="flex items-center gap-3">
					<span className="text-sm text-slate-600">{user?.name || "Guest"}</span>
					<button type="button" onClick={handleLogout} className="rounded-md bg-slate-900 px-3 py-1 text-sm text-white">
						Logout
					</button>
				</div>
			</div>
		</header>
	);
}

