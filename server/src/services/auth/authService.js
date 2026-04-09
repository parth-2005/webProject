import { ApiError } from "../../utils/apiError.js";
import { User } from "../../models/User.model.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./tokenService.js";

/**
 * Authenticate a user by email/password and return tokens + user info.
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<{ accessToken: string, refreshToken: string, user: { id: string, name: string, email: string, role: string } }>}
 */
export async function loginWithEmailPassword({ email, password }) {
  const user = await User.findOne({ email }).exec();
  if (!user || !user.isActive) throw new ApiError(401, "Invalid credentials");

  const ok = await user.verifyPassword(password);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const payload = { sub: String(user._id), role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
  };
}

/**
 * Exchange a refresh token for a new access token (and rotated refresh token).
 * @param {object} params
 * @param {string} params.refreshToken
 * @returns {{ accessToken: string, refreshToken: string }}
 */
export function refreshTokens({ refreshToken }) {
  if (!refreshToken) throw new ApiError(401, "Missing refresh token");
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const nextPayload = { sub: payload.sub, role: payload.role, email: payload.email };
  return {
    accessToken: signAccessToken(nextPayload),
    refreshToken: signRefreshToken(nextPayload),
  };
}

