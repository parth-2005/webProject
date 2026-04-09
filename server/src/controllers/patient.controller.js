import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createPatientRecord,
  getPatientRecordById,
  listPatients,
  updatePatientRecord,
} from "../services/patients/patientService.js";

/**
 * GET /api/patients
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getPatients = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const data = await listPatients({ page, limit, search });

  res.status(200).json(
    new ApiResponse({ success: true, statusCode: 200, data, message: "Patients retrieved successfully" }),
  );
});

/**
 * POST /api/patients
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createPatient = asyncHandler(async (req, res) => {
  const patient = await createPatientRecord(req.body);

  res.status(201).json(
    new ApiResponse({ success: true, statusCode: 201, data: patient, message: "Patient created successfully" }),
  );
});

/**
 * GET /api/patients/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getPatientById = asyncHandler(async (req, res) => {
  const patient = await getPatientRecordById(req.params.id);

  res.status(200).json(
    new ApiResponse({ success: true, statusCode: 200, data: patient, message: "Patient retrieved successfully" }),
  );
});

/**
 * PUT /api/patients/:id
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const updatePatient = asyncHandler(async (req, res) => {
  const patient = await updatePatientRecord(req.params.id, req.body);

  res.status(200).json(
    new ApiResponse({ success: true, statusCode: 200, data: patient, message: "Patient updated successfully" }),
  );
});
