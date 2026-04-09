import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../services/api.js";

/**
 * Fetch doctors list.
 * @returns {import("@tanstack/react-query").UseQueryResult<any, Error>}
 */
export function useDoctors() {
	return useQuery({
		queryKey: ["doctors"],
		queryFn: async () => (await api.get("/doctors")).data?.data,
	});
}

/**
 * Fetch doctor slots for a date.
 * @param {string} doctorId
 * @param {string} date
 * @returns {import("@tanstack/react-query").UseQueryResult<any, Error>}
 */
export function useDoctorSlots(doctorId, date) {
	return useQuery({
		queryKey: ["doctor-slots", doctorId, date],
		enabled: Boolean(doctorId && date),
		queryFn: async () => (await api.get(`/doctors/${doctorId}/slots`, { params: { date } })).data?.data,
	});
}

/**
 * Update doctor schedule.
 * @returns {import("@tanstack/react-query").UseMutationResult<any, Error, { doctorId: string, payload: any }>}
 */
export function useUpdateDoctorSchedule() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ doctorId, payload }) => (await api.put(`/doctors/${doctorId}/schedule`, payload)).data?.data,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctors"] }),
	});
}

