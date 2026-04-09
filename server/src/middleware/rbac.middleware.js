import { ApiError } from "../utils/apiError.js";

/**
 * Role-based access control middleware factory.
 * @param  {...string} allowedRoles
 * @returns {(req: any, res: any, next: any) => void}
 */
export function rbac(...allowedRoles) {
  return function rbacMiddleware(req, res, next) {
    if (!req.user?.role) return next(new ApiError(401, "Unauthorized"));
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Access denied"));
    }
    return next();
  };
}

