import { Link } from "react-router-dom";

import { useAppointments } from "../hooks/useAppointments.js";
import { api } from "../services/api.js";
import { useQuery } from "@tanstack/react-query";

/**
 * Main dashboard page.
 * @returns {JSX.Element}
 */
export default function Dashboard() {
	const today = new Date().toISOString().slice(0, 10);
	const appointmentsQuery = useAppointments({ date: today, page: 1, limit: 8 });
	const summaryQuery = useQuery({
		queryKey: ["analytics-summary-dashboard"],
		queryFn: async () => (await api.get("/analytics/summary")).data?.data,
	});

	const summary = summaryQuery.data || { totalAppointments: 0, noShowRate: 0, repeatPatients: 0 };

	return (
		<div className="space-y-5">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Total Appointments</p><p className="text-2xl font-semibold">{summary.totalAppointments}</p></div>
				<div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">No-show Rate</p><p className="text-2xl font-semibold">{summary.noShowRate}%</p></div>
				<div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Repeat Patients</p><p className="text-2xl font-semibold">{summary.repeatPatients}</p></div>
			</div>

			<div className="flex gap-3">
				<Link to="/patients/new" className="rounded-md bg-sky-700 text-white px-4 py-2 text-sm">New Patient</Link>
				<Link to="/appointments/book" className="rounded-md bg-emerald-700 text-white px-4 py-2 text-sm">Book Appointment</Link>
			</div>

			<section className="rounded-lg border border-slate-200 bg-white p-4">
				<h2 className="text-lg font-semibold mb-3">Today&apos;s Appointments</h2>
				{appointmentsQuery.isLoading ? <p>Loading...</p> : (
					<ul className="space-y-2">
						{(appointmentsQuery.data?.appointments || []).map((item) => (
							<li key={item._id} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2">
								<span>{item.patientId?.name || "Patient"}</span>
								<span className="text-sm text-slate-500">{item.slotTime}</span>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}

