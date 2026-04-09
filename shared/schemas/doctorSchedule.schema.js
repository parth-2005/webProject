import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");

const slotSchema = z.object({
  start: z.string(),
  end: z.string(),
});

/**
 * Zod schema matching the plan's MongoDB `DoctorSchedule` shape.
 */
export const doctorScheduleSchema = z.object({
  _id: objectIdSchema.optional(),
  doctorId: objectIdSchema,
  weeklySlots: z.object({
    monday: z.array(slotSchema),
    tuesday: z.array(slotSchema),
    wednesday: z.array(slotSchema),
    thursday: z.array(slotSchema),
    friday: z.array(slotSchema),
    saturday: z.array(slotSchema),
    sunday: z.array(slotSchema),
  }),
  blockedDates: z.array(z.coerce.date()),
});

