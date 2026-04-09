import {
  createAppointmentRecord,
  deleteAppointmentRecord,
  listAppointments,
  updateAppointmentRecord,
} from "../services/appointments/appointmentService.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * GET /api/appointments
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAppointments = asyncHandler(async (req, res) => {
  const { doctorId, date, status, page = 1, limit = 10 } = req.query;
  const data = await listAppointments({
    doctorId,
    date,
    status,
    page: parseInt(page),
    limit: parseInt(limit),
  });

  res.status(200).json(
    new ApiResponse({ success: true, statusCode: 200, data, message: "Appointments retrieved successfully" }),
  );
});

/**
 * POST /api/appointments
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createNewAppointment = asyncHandler(async (req, res) => {
  const appointment = await createAppointmentRecord(req.body);
  
  res.status(201).json(
    new ApiResponse({ success: true, statusCode: 201, data: appointment, message: "Appointment created successfully" }),
  );
});

/**
 * PUT /api/appointments/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await updateAppointmentRecord(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse({ success: true, statusCode: 200, data: appointment, message: "Appointment updated successfully" }),
  );
});

/**
 * DELETE /api/appointments/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const deleteAppointment = asyncHandler(async (req, res) => {
  await deleteAppointmentRecord(req.params.id);

  res.status(200).json(
    new ApiResponse({ success: true, statusCode: 200, data: null, message: "Appointment deleted successfully" }),
  );
});
