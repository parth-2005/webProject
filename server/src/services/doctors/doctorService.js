import { ROLES } from "shared/constants/roles.js";

import { DoctorSchedule } from "../../models/DoctorSchedule.model.js";
import { User } from "../../models/User.model.js";
import { resolveSlots } from "../appointments/slotResolver.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * Return active doctors list.
 * @returns {Promise<any[]>}
 */
export async function listDoctors() {
  return User.find({ role: ROLES.DOCTOR, isActive: true }).select("-passwordHash");
}

/**
 * Resolve available slots for a doctor and date.
 * @param {string} doctorId
 * @param {string} date
 * @returns {Promise<Array<{start: string, end: string}>>}
 */
export async function listDoctorSlots(doctorId, date) {
  if (!date) {
    throw new ApiError(400, "Date query parameter is required");
  }
  return resolveSlots(doctorId, date);
}

/**
 * Upsert a doctor schedule.
 * @param {string} doctorId
 * @param {Record<string, any>} scheduleData
 * @returns {Promise<any>}
 */
export async function saveDoctorSchedule(doctorId, scheduleData) {
  const doctor = await User.findOne({ _id: doctorId, role: ROLES.DOCTOR });
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  const { _id, doctorId: bodyDoctorId, ...payload } = scheduleData;
  return DoctorSchedule.findOneAndUpdate(
    { doctorId },
    { $set: payload },
    { new: true, upsert: true, runValidators: true },
  );
}