import { useQuery } from "@tanstack/react-query";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { api } from "../../services/api.js";

/**
 * Analytics dashboard page.
 * @returns {JSX.Element}
 */
export default function AnalyticsDashboard() {
	const query = useQuery({
		queryKey: ["analytics-summary"],
		queryFn: async () => (await api.get("/analytics/summary")).data?.data,
	});

	const data = query.data || { totalAppointments: 0, noShowRate: 0, repeatPatients: 0, dailyTrends: [] };

	return (
		<section className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Total Appointments</p><p className="text-2xl font-semibold">{data.totalAppointments}</p></div>
				<div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">No-show Rate</p><p className="text-2xl font-semibold">{data.noShowRate}%</p></div>
				<div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">Repeat Patients</p><p className="text-2xl font-semibold">{data.repeatPatients}</p></div>
			</div>

			<div className="rounded-lg border border-slate-200 bg-white p-4 h-80">
				<h3 className="text-base font-semibold mb-3">Daily Trends</h3>
				<ResponsiveContainer width="100%" height="90%">
					<LineChart data={data.dailyTrends}>
						<XAxis dataKey="date" />
						<YAxis allowDecimals={false} />
						<Tooltip />
						<Line type="monotone" dataKey="count" stroke="#0284c7" strokeWidth={2} dot={false} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</section>
	);
}

