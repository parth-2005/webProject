import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";

/**
 * Create a signed JWT access token.
 * @param {object} payload
 * @returns {string}
 */
export function signAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRY });
}

/**
 * Create a signed JWT refresh token.
 * @param {object} payload
 * @returns {string}
 */
export function signRefreshToken(payload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_EXPIRY });
}

/**
 * Verify an access token and return its payload.
 * @param {string} token
 * @returns {any}
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

/**
 * Verify a refresh token and return its payload.
 * @param {string} token
 * @returns {any}
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

