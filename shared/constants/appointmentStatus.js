/**
 * Appointment status constants used across client and server.
 */
export const APPOINTMENT_STATUS = Object.freeze({
  BOOKED: "booked",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no-show",
});

/**
 * Appointment status values (for validation).
 */
export const APPOINTMENT_STATUS_VALUES = Object.freeze([
  APPOINTMENT_STATUS.BOOKED,
  APPOINTMENT_STATUS.COMPLETED,
  APPOINTMENT_STATUS.CANCELLED,
  APPOINTMENT_STATUS.NO_SHOW,
]);

