import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");

const visitHistoryItemSchema = z.object({
  appointmentId: objectIdSchema,
  date: z.coerce.date(),
  doctorId: objectIdSchema,
  notes: z.string(),
});

/**
 * Zod schema matching the plan's MongoDB `Patient` shape.
 */
export const patientSchema = z.object({
  _id: objectIdSchema.optional(),
  name: z.string(),
  phone: z.string(),
  age: z.number(),
  gender: z.enum(["male", "female", "other"]),
  bloodGroup: z.string(),
  address: z.string(),
  visitHistory: z.array(visitHistoryItemSchema),
  whatsappOptIn: z.boolean().default(true).optional(),
  createdAt: z.coerce.date().optional(),
});

