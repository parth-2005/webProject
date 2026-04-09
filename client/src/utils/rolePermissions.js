/**
 * Role-based navigation permissions.
 */
export const rolePermissions = {
	admin: ["dashboard", "patients", "appointments", "doctors", "analytics", "ai/notes"],
	doctor: ["dashboard", "patients", "appointments", "doctors", "analytics", "ai/notes"],
	receptionist: ["dashboard", "patients", "appointments", "doctors"],
};

