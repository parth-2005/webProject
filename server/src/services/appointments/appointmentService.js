import { APPOINTMENT_STATUS } from "shared/constants/appointmentStatus.js";

import { Appointment } from "../../models/Appointment.model.js";
import { ApiError } from "../../utils/apiError.js";
import { cancelAppointment, createAppointment, rescheduleAppointment } from "./bookingService.js";

/**
 * Fetch paginated appointments with optional filters.
 * @param {{ doctorId?: string, date?: string, status?: string, page?: number, limit?: number }} params
 * @returns {Promise<{ appointments: any[], total: number, page: number, pages: number }>}
 */
export async function listAppointments({ doctorId, date, status, page = 1, limit = 10 }) {
  const query = {};
  if (doctorId) query.doctorId = doctorId;
  if (status) query.status = status;
  if (date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    query.date = { $gte: targetDate, $lt: nextDay };
  }

  const skip = (page - 1) * limit;
  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate("patientId", "name phone")
      .populate("doctorId", "name doctorProfile")
      .sort({ date: 1, slotTime: 1 })
      .skip(skip)
      .limit(limit),
    Appointment.countDocuments(query),
  ]);

  return {
    appointments,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Create a new appointment.
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 */
export async function createAppointmentRecord(payload) {
  return createAppointment(payload);
}

/**
 * Update appointment by handling cancel and reschedule flows.
 * @param {string} appointmentId
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 */
export async function updateAppointmentRecord(appointmentId, payload) {
  const { date, slotTime, status, ...rest } = payload;

  let appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  const isReschedule = Boolean(
    date
      && slotTime
      && (new Date(date).getTime() !== new Date(appointment.date).getTime() || slotTime !== appointment.slotTime),
  );

  if (isReschedule) {
    appointment = await rescheduleAppointment(appointmentId, date, slotTime);
    if (Object.keys(rest).length > 0 || status) {
      appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { $set: { ...rest, status: status || appointment.status } },
        { new: true, runValidators: true },
      );
    }
    return appointment;
  }

  if (status === APPOINTMENT_STATUS.CANCELLED) {
    return cancelAppointment(appointmentId);
  }

  return Appointment.findByIdAndUpdate(appointmentId, { $set: payload }, { new: true, runValidators: true });
}

/**
 * Delete appointment by id.
 * @param {string} appointmentId
 * @returns {Promise<void>}
 */
export async function deleteAppointmentRecord(appointmentId) {
  const appointment = await Appointment.findByIdAndDelete(appointmentId);
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }
}