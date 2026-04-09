import { ApiError } from "../utils/apiError.js";
import { verifyAccessToken } from "../services/auth/tokenService.js";

/**
 * Verify JWT access token and attach `req.user`.
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {void}
 */
export function authenticate(req, res, next) {
  const header = req.headers?.authorization;
  const token = typeof header === "string" && header.startsWith("Bearer ")
    ? header.slice("Bearer ".length).trim()
    : null;

  if (!token) return next(new ApiError(401, "Missing access token"));

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
    };
    return next();
  } catch {
    return next(new ApiError(401, "Invalid access token"));
  }
}

