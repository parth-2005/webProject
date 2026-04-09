import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * Global Express error handler.
 * @param {any} err
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {void}
 */
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const statusCode =
    err instanceof ApiError
      ? err.statusCode
      : Number.isInteger(err?.statusCode)
        ? err.statusCode
        : 500;

  const message =
    typeof err?.message === "string" && err.message.length > 0
      ? err.message
      : "Internal Server Error";

  res.status(statusCode).json(
    new ApiResponse({
      success: false,
      statusCode,
      data: null,
      message,
    }),
  );
}

