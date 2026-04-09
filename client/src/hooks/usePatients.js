import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createPatient, getPatient, listPatients, updatePatient } from "../services/patient.api.js";

/**
 * Hook for patient list queries.
 * @param {{ search?: string, page?: number, limit?: number }} params
 * @returns {import("@tanstack/react-query").UseQueryResult<any, Error>}
 */
export function usePatients(params) {
	return useQuery({ queryKey: ["patients", params], queryFn: () => listPatients(params) });
}

/**
 * Hook for one patient detail query.
 * @param {string} id
 * @returns {import("@tanstack/react-query").UseQueryResult<any, Error>}
 */
export function usePatient(id) {
	return useQuery({ queryKey: ["patient", id], queryFn: () => getPatient(id), enabled: Boolean(id) });
}

/**
 * Hook for creating patient records.
 * @returns {import("@tanstack/react-query").UseMutationResult<any, Error, any>}
 */
export function useCreatePatient() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createPatient,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
	});
}

/**
 * Hook for updating patient records.
 * @returns {import("@tanstack/react-query").UseMutationResult<any, Error, { id: string, payload: any }>}
 */
export function useUpdatePatient() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, payload }) => updatePatient(id, payload),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["patients"] });
			queryClient.invalidateQueries({ queryKey: ["patient", variables.id] });
		},
	});
}

