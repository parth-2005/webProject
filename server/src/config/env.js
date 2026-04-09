import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  MONGO_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_EXPIRY: z.string().min(1).default("15m"),
  REFRESH_EXPIRY: z.string().min(1).default("7d"),

  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL: z.string().min(1).default("gemini-1.5-flash"),

  HOSPITAL_NAME: z.string().min(1),
  HOSPITAL_PHONE: z.string().min(1),
});

/**
 * Validated environment variables (throws on invalid/missing).
 */
export const env = (() => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((i) => `${i.path.join(".") || "env"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${message}`);
  }
  return parsed.data;
})();

