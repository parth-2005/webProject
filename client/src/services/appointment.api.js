import { api } from "./api.js";

/**
 * List appointments with filters.
 * @param {{ doctorId?: string, date?: string, status?: string, page?: number, limit?: number }} params
 * @returns {Promise<any>}
 */
export async function listAppointments(params) {
	const response = await api.get("/appointments", { params });
	return response.data?.data;
}

/**
 * Create appointment.
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 */
export async function createAppointment(payload) {
	const response = await api.post("/appointments", payload);
	return response.data?.data;
}

/**
 * Update appointment.
 * @param {string} id
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 */
export async function updateAppointment(id, payload) {
	const response = await api.put(`/appointments/${id}`, payload);
	return response.data?.data;
}

/**
 * Delete appointment.
 * @param {string} id
 * @returns {Promise<any>}
 */
export async function deleteAppointment(id) {
	const response = await api.delete(`/appointments/${id}`);
	return response.data?.data;
}

