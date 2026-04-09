import { api } from "./api.js";

/**
 * Fetch paginated patients list.
 * @param {{ search?: string, page?: number, limit?: number }} params
 * @returns {Promise<any>}
 */
export async function listPatients(params) {
	const response = await api.get("/patients", { params });
	return response.data?.data;
}

/**
 * Fetch patient detail by id.
 * @param {string} id
 * @returns {Promise<any>}
 */
export async function getPatient(id) {
	const response = await api.get(`/patients/${id}`);
	return response.data?.data;
}

/**
 * Create patient record.
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 */
export async function createPatient(payload) {
	const response = await api.post("/patients", payload);
	return response.data?.data;
}

/**
 * Update patient record.
 * @param {string} id
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 */
export async function updatePatient(id, payload) {
	const response = await api.put(`/patients/${id}`, payload);
	return response.data?.data;
}

