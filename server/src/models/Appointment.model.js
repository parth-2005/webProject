import mongoose, { Schema } from "mongoose";
import { APPOINTMENT_STATUS } from "shared/constants/appointmentStatus.js";

const AppointmentSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  slotTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      APPOINTMENT_STATUS.BOOKED,
      APPOINTMENT_STATUS.COMPLETED,
      APPOINTMENT_STATUS.CANCELLED,
      APPOINTMENT_STATUS.NO_SHOW,
    ],
    default: APPOINTMENT_STATUS.BOOKED,
  },
  bookedVia: {
    type: String,
    enum: ["dashboard", "whatsapp"],
    default: "dashboard",
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
  followUpSent: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: null,
  },
}, { timestamps: true });

AppointmentSchema.index({ doctorId: 1, date: 1, status: 1 });

export const Appointment = mongoose.model("Appointment", AppointmentSchema);
