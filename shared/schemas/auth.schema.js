import { z } from "zod";

/**
 * Zod schema for the auth login request body.
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

