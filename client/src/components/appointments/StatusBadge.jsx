/**
 * Appointment status badge.
 * @param {{ status: string }} props
 * @returns {JSX.Element}
 */
export default function StatusBadge({ status }) {
	const styleByStatus = {
		booked: "bg-blue-100 text-blue-800",
		completed: "bg-emerald-100 text-emerald-800",
		cancelled: "bg-rose-100 text-rose-800",
		"no-show": "bg-amber-100 text-amber-800",
	};
	return <span className={`rounded-full px-2 py-1 text-xs font-medium ${styleByStatus[status] || "bg-slate-100 text-slate-800"}`}>{status}</span>;
}

