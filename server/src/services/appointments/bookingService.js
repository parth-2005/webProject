import { Appointment } from "../../models/Appointment.model.js";
import { resolveSlots } from "./slotResolver.js";
import { ApiError } from "../../utils/apiError.js";
import { APPOINTMENT_STATUS } from "shared/constants/appointmentStatus.js";

/**
 * Creates a new appointment
 * @param {Object} data - Appointment data
 * @returns {Promise<Object>} Created appointment
 */
export async function createAppointment(data) {
  // Check slot availability before creation
  const availableSlots = await resolveSlots(data.doctorId, data.date);
  const isAvailable = availableSlots.some((slot) => slot.start === data.slotTime);
  
  // If not available, error out
  if (!isAvailable) {
    throw new ApiError(400, "The requested slot is no longer available.");
  }

  const appointment = await Appointment.create(data);
  return appointment;
}

/**
 * Cancels an appointment
 * @param {string} appointmentId
 * @returns {Promise<Object>} Updated appointment
 */
export async function cancelAppointment(appointmentId) {
  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status: APPOINTMENT_STATUS.CANCELLED },
    { new: true, runValidators: true }
  );

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  return appointment;
}

/**
 * Reschedules an appointment (updates date/slotTime)
 * @param {string} appointmentId
 * @param {Date} newDate
 * @param {string} newSlotTime
 * @returns {Promise<Object>} Updated appointment
 */
export async function rescheduleAppointment(appointmentId, newDate, newSlotTime) {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (appointment.status === APPOINTMENT_STATUS.CANCELLED || appointment.status === APPOINTMENT_STATUS.NO_SHOW) {
    throw new ApiError(400, "Cannot reschedule a cancelled or no-show appointment");
  }

  // Check new slot availability
  const availableSlots = await resolveSlots(appointment.doctorId, newDate);
  const isAvailable = availableSlots.some((slot) => slot.start === newSlotTime);
  
  if (!isAvailable) {
    throw new ApiError(400, "The requested slot is no longer available.");
  }

  appointment.date = newDate;
  appointment.slotTime = newSlotTime;
  appointment.status = APPOINTMENT_STATUS.BOOKED;
  // reset reminders on reschedule
  appointment.reminderSent = false;
  appointment.followUpSent = false;

  await appointment.save();
  return appointment;
}
