import { z } from "zod";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");

const historyItemSchema = z.object({
  role: z.enum(["user", "model"]),
  content: z.string(),
  timestamp: z.coerce.date(),
});

/**
 * Zod schema matching the plan's MongoDB `Conversation` shape.
 */
export const conversationSchema = z.object({
  _id: objectIdSchema.optional(),
  phone: z.string(),
  patientId: objectIdSchema.nullable().optional(),
  state: z
    .enum(["idle", "triage", "booking", "awaiting_confirm"])
    .default("idle")
    .optional(),
  context: z.unknown().optional(),
  history: z.array(historyItemSchema),
  updatedAt: z.coerce.date().optional(),
});

