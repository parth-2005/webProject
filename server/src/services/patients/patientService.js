import { Patient } from "../../models/Patient.model.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * Fetch paginated patients with optional text search.
 * @param {{ page?: number, limit?: number, search?: string }} params
 * @returns {Promise<{ patients: any[], total: number, page: number, pages: number }>} 
 */
export async function listPatients({ page = 1, limit = 10, search = "" }) {
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const [patients, total] = await Promise.all([
    Patient.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Patient.countDocuments(query),
  ]);

  return {
    patients,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Create a patient if phone is unique.
 * @param {Record<string, any>} patientData
 * @returns {Promise<any>}
 */
export async function createPatientRecord(patientData) {
  const existing = await Patient.findOne({ phone: patientData.phone });
  if (existing) {
    throw new ApiError(409, "Patient with this phone number already exists");
  }

  const { _id, ...payload } = patientData;
  return Patient.create(payload);
}

/**
 * Fetch one patient by id.
 * @param {string} id
 * @returns {Promise<any>}
 */
export async function getPatientRecordById(id) {
  const patient = await Patient.findById(id).populate("visitHistory.doctorId", "name doctorProfile");
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }
  return patient;
}

/**
 * Update a patient by id.
 * @param {string} id
 * @param {Record<string, any>} patientData
 * @returns {Promise<any>}
 */
export async function updatePatientRecord(id, patientData) {
  const { _id, ...payload } = patientData;
  const patient = await Patient.findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true });
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }
  return patient;
}