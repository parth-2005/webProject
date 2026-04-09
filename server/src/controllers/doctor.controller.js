import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { listDoctors, listDoctorSlots, saveDoctorSchedule } from "../services/doctors/doctorService.js";

/**
 * GET /api/doctors
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await listDoctors();

  res.status(200).json(
    new ApiResponse({ success: true, statusCode: 200, data: doctors, message: "Doctors retrieved successfully" }),
  );
});

/**
 * GET /api/doctors/:id/slots
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getDoctorSlots = asyncHandler(async (req, res) => {
  const slots = await listDoctorSlots(req.params.id, req.query.date);

  res.status(200).json(
    new ApiResponse({ success: true, statusCode: 200, data: slots, message: "Available slots retrieved successfully" }),
  );
});

/**
 * PUT /api/doctors/:id/schedule
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const updateDoctorSchedule = asyncHandler(async (req, res) => {
  const schedule = await saveDoctorSchedule(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse({ success: true, statusCode: 200, data: schedule, message: "Doctor schedule updated successfully" }),
  );
});
