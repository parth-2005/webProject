import { Navigate } from "react-router-dom";

import { useAuthStore } from "../../store/authStore.js";

/**
 * Route guard component checking role against allowed roles.
 * @param {{ allowedRoles: string[], children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export default function RoleGuard({ allowedRoles, children }) {
	const role = useAuthStore((state) => state.role);
	if (!role) return <Navigate to="/login" replace />;
	if (!allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;
	return children;
}

