import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	createAppointment,
	deleteAppointment,
	listAppointments,
	updateAppointment,
} from "../services/appointment.api.js";

/**
 * Hook for appointment list with filters.
 * @param {{ doctorId?: string, date?: string, status?: string, page?: number, limit?: number }} params
 * @returns {import("@tanstack/react-query").UseQueryResult<any, Error>}
 */
export function useAppointments(params) {
	return useQuery({ queryKey: ["appointments", params], queryFn: () => listAppointments(params) });
}

/**
 * Hook for creating appointments.
 * @returns {import("@tanstack/react-query").UseMutationResult<any, Error, any>}
 */
export function useCreateAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createAppointment,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
	});
}

/**
 * Hook for updating appointment data.
 * @returns {import("@tanstack/react-query").UseMutationResult<any, Error, { id: string, payload: any }>}
 */
export function useUpdateAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, payload }) => updateAppointment(id, payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
	});
}

/**
 * Hook for deleting appointments.
 * @returns {import("@tanstack/react-query").UseMutationResult<any, Error, string>}
 */
export function useDeleteAppointment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteAppointment,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
	});
}

