import { ApiError } from "../utils/apiError.js";

/**
 * Validate `req.body` against a Zod schema.
 * @param {import("zod").ZodSchema} schema
 * @returns {(req: any, res: any, next: any) => void}
 */
export function validateBody(schema) {
  return function validateBodyMiddleware(req, res, next) {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((i) => i.message).join(", ");
      return next(new ApiError(400, message));
    }
    req.body = parsed.data;
    return next();
  };
}

