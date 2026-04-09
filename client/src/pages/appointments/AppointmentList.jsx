import { useState } from "react";

import StatusBadge from "../../components/appointments/StatusBadge.jsx";
import { useAppointments, useUpdateAppointment } from "../../hooks/useAppointments.js";

/**
 * Appointment list page.
 * @returns {JSX.Element}
 */
export default function AppointmentList() {
	const [filters, setFilters] = useState({ page: 1, limit: 10, status: "" });
	const query = useAppointments(filters);
	const updateMutation = useUpdateAppointment();

	const appointments = query.data?.appointments || [];

	return (
		<section className="space-y-4">
			<div className="flex items-center gap-2">
				<select className="rounded border px-2 py-1" value={filters.status} onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value, page: 1 }))}>
					<option value="">All Status</option>
					<option value="booked">booked</option>
					<option value="completed">completed</option>
					<option value="cancelled">cancelled</option>
					<option value="no-show">no-show</option>
				</select>
			</div>

			<div className="rounded-lg border border-slate-200 bg-white overflow-auto">
				<table className="w-full text-sm">
					<thead className="bg-slate-50 text-left">
						<tr>
							<th className="px-3 py-2">Patient</th>
							<th className="px-3 py-2">Doctor</th>
							<th className="px-3 py-2">Date</th>
							<th className="px-3 py-2">Slot</th>
							<th className="px-3 py-2">Status</th>
							<th className="px-3 py-2">Action</th>
						</tr>
					</thead>
					<tbody>
						{appointments.map((item) => (
							<tr key={item._id} className="border-t border-slate-100">
								<td className="px-3 py-2">{item.patientId?.name}</td>
								<td className="px-3 py-2">{item.doctorId?.name}</td>
								<td className="px-3 py-2">{new Date(item.date).toLocaleDateString()}</td>
								<td className="px-3 py-2">{item.slotTime}</td>
								<td className="px-3 py-2"><StatusBadge status={item.status} /></td>
								<td className="px-3 py-2">
									<button type="button" className="text-xs rounded border px-2 py-1" onClick={() => updateMutation.mutate({ id: item._id, payload: { status: "completed" } })}>
										Mark Complete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}

