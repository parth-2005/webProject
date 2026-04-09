import { loginSchema } from "shared/schemas/auth.schema.js";

import { env } from "../config/env.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { loginWithEmailPassword, refreshTokens } from "../services/auth/authService.js";
import { ApiError } from "../utils/apiError.js";

const REFRESH_COOKIE_NAME = "refreshToken";

/**
 * Cookie settings for refresh token cookie.
 * @returns {import("express").CookieOptions}
 */
export function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/api/auth",
  };
}

/**
 * Middleware validating login body.
 */
export const validateLoginBody = validateBody(loginSchema);

/**
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await loginWithEmailPassword({
    email,
    password,
  });

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
  res.status(200).json(
    new ApiResponse({
      success: true,
      statusCode: 200,
      data: { accessToken, user },
      message: "Logged in",
    }),
  );
});

/**
 * POST /api/auth/refresh
 */
export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  const { accessToken, refreshToken: nextRefresh } = refreshTokens({ refreshToken });

  res.cookie(REFRESH_COOKIE_NAME, nextRefresh, getRefreshCookieOptions());
  res.status(200).json(
    new ApiResponse({
      success: true,
      statusCode: 200,
      data: { accessToken },
      message: "Token refreshed",
    }),
  );
});

/**
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  if (!req.cookies) throw new ApiError(400, "Cookies not available");

  res.clearCookie(REFRESH_COOKIE_NAME, getRefreshCookieOptions());
  res.status(200).json(
    new ApiResponse({
      success: true,
      statusCode: 200,
      data: null,
      message: "Logged out",
    }),
  );
});

