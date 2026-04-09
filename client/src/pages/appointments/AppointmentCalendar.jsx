import { useState } from "react";

import { useAppointments } from "../../hooks/useAppointments.js";

/**
 * Appointment calendar page with day/week toggles.
 * @returns {JSX.Element}
 */
export default function AppointmentCalendar() {
	const [mode, setMode] = useState("day");
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

	const query = useAppointments({ date, page: 1, limit: 50 });
	const items = query.data?.appointments || [];

	return (
		<section className="space-y-4">
			<div className="flex flex-wrap items-center gap-2">
				<input type="date" className="rounded border px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
				<button type="button" className={`rounded border px-3 py-1 ${mode === "day" ? "bg-slate-900 text-white" : ""}`} onClick={() => setMode("day")}>Day</button>
				<button type="button" className={`rounded border px-3 py-1 ${mode === "week" ? "bg-slate-900 text-white" : ""}`} onClick={() => setMode("week")}>Week</button>
			</div>
			<div className="rounded-lg border border-slate-200 bg-white p-4">
				<h2 className="text-base font-semibold mb-3">{mode === "day" ? "Day View" : "Week View"}</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
					{items.map((item) => (
						<div key={item._id} className="rounded border border-slate-200 p-3">
							<p className="font-medium">{item.patientId?.name}</p>
							<p className="text-sm text-slate-500">{item.slotTime}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

