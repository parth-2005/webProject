/**
 * Role constants used across client and server.
 */
export const ROLES = Object.freeze({
  ADMIN: "admin",
  DOCTOR: "doctor",
  RECEPTIONIST: "receptionist",
});

/**
 * Role values (for validation).
 */
export const ROLE_VALUES = Object.freeze([
  ROLES.ADMIN,
  ROLES.DOCTOR,
  ROLES.RECEPTIONIST,
]);

