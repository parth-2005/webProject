import { getAnalyticsSummary } from "../services/analytics/analyticsService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * GET /api/analytics/summary
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getSummary = asyncHandler(async (req, res) => {
  const data = await getAnalyticsSummary({ from: req.query.from, to: req.query.to });

  res.status(200).json(
    new ApiResponse({ success: true, statusCode: 200, data, message: "Analytics summary retrieved successfully" }),
  );
});