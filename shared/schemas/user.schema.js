import { z } from "zod";

import { ROLE_VALUES } from "../constants/roles.js";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId");

const doctorProfileSchema = z.object({
  specialization: z.string(),
  bio: z.string(),
  avatarUrl: z.string().url(),
});

/**
 * Zod schema matching the plan's MongoDB `User` shape.
 */
export const userSchema = z.object({
  _id: objectIdSchema.optional(),
  name: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  role: z.enum(ROLE_VALUES),
  doctorProfile: doctorProfileSchema.optional(),
  isActive: z.boolean().default(true).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

