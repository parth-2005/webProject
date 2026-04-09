import { Link, useLocation } from "react-router-dom";

import { useAuthStore } from "../../store/authStore.js";
import { useUiStore } from "../../store/uiStore.js";
import { rolePermissions } from "../../utils/rolePermissions.js";

const navItems = [
	{ key: "dashboard", label: "Dashboard", to: "/dashboard" },
	{ key: "patients", label: "Patients", to: "/patients" },
	{ key: "appointments", label: "Appointments", to: "/appointments" },
	{ key: "doctors", label: "Doctors", to: "/doctors" },
	{ key: "analytics", label: "Analytics", to: "/analytics" },
	{ key: "ai/notes", label: "AI Notes", to: "/ai/notes" },
];

/**
 * Sidebar with role-filtered navigation links.
 * @returns {JSX.Element}
 */
export default function Sidebar() {
	const location = useLocation();
	const role = useAuthStore((state) => state.role);
	const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed);

	const allowed = rolePermissions[role] || [];
	const items = navItems.filter((item) => allowed.includes(item.key));

	return (
		<aside className={`border-r border-slate-200 bg-white/80 backdrop-blur ${isSidebarCollapsed ? "hidden md:block md:w-20" : "w-full md:w-64"}`}>
			<div className="px-4 py-5 border-b border-slate-200">
				<h1 className="text-lg font-semibold text-slate-900">Hospital AI</h1>
			</div>
			<nav className="p-3 space-y-1">
				{items.map((item) => (
					<Link
						key={item.key}
						to={item.to}
						className={`block rounded-md px-3 py-2 text-sm ${location.pathname.startsWith(item.to) ? "bg-sky-100 text-sky-800" : "text-slate-700 hover:bg-slate-100"}`}
					>
						{item.label}
					</Link>
				))}
			</nav>
		</aside>
	);
}

