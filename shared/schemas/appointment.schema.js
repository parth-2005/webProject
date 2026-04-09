import { z } from "zod";

import { APPOINTMENT_STATUS_VALUES } from "../constants/appointmentStatus.js";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");

/**
 * Zod schema matching the plan's MongoDB `Appointment` shape.
 */
export const appointmentSchema = z.object({
  _id: objectIdSchema.optional(),
  patientId: objectIdSchema,
  doctorId: objectIdSchema,
  date: z.coerce.date(),
  slotTime: z.string(),
  status: z.enum(APPOINTMENT_STATUS_VALUES),
  bookedVia: z.enum(["dashboard", "whatsapp"]),
  reminderSent: z.boolean().default(false).optional(),
  followUpSent: z.boolean().default(false).optional(),
  notes: z.string(),
  createdAt: z.coerce.date().optional(),
});

