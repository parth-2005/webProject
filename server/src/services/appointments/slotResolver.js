import mongoose from "mongoose";
import { APPOINTMENT_STATUS } from "shared/constants/appointmentStatus.js";
import { DoctorSchedule } from "../../models/DoctorSchedule.model.js";
import { Appointment } from "../../models/Appointment.model.js";

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

/**
 * Resolves available slots for a given doctor on a given date.
 *
 * @param {string} doctorId - the ObjectId of the doctor
 * @param {Date|string} dateStr - the target date
 * @returns {Promise<Array<{start: string, end: string}>>}
 */
export async function resolveSlots(doctorId, dateStr) {
  const targetDate = new Date(dateStr);
  
  if (isNaN(targetDate.getTime())) {
    throw new Error("Invalid date provided to resolveSlots");
  }

  targetDate.setHours(0, 0, 0, 0); // normalize to midnight local time for matching

  const schedule = await DoctorSchedule.findOne({ doctorId });
  if (!schedule) {
    return [];
  }

  // Check if blocked
  const isBlocked = schedule.blockedDates.some((blocked) => {
    const b = new Date(blocked);
    b.setHours(0, 0, 0, 0);
    return b.getTime() === targetDate.getTime();
  });

  if (isBlocked) {
    return [];
  }

  const dayOfWeek = WEEKDAYS[targetDate.getDay()];
  const daySlots = schedule.weeklySlots[dayOfWeek] || [];

  if (daySlots.length === 0) {
    return [];
  }

  // Find booked slots for this doctor on this day
  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const bookedAppointments = await Appointment.find({
    doctorId,
    date: { $gte: targetDate, $lt: nextDay },
    status: { $in: [APPOINTMENT_STATUS.BOOKED] }
  });

  const bookedSlotTimes = bookedAppointments.map((appt) => appt.slotTime);

  return daySlots.filter((slot) => !bookedSlotTimes.includes(slot.start));
}
