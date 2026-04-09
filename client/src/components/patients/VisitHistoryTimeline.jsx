import { formatDate } from "../../utils/formatters.js";

/**
 * Visit history timeline list.
 * @param {{ visits: Array<{ date: string, notes: string, doctorId?: { name?: string } }> }} props
 * @returns {JSX.Element}
 */
export default function VisitHistoryTimeline({ visits }) {
	if (!visits?.length) {
		return <p className="text-sm text-slate-500">No visit history yet.</p>;
	}

	return (
		<ol className="space-y-3">
			{visits.map((visit, idx) => (
				<li key={`${visit.date}-${idx}`} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
					<p className="text-sm font-medium">{formatDate(visit.date)} · {visit.doctorId?.name || "Doctor"}</p>
					<p className="text-sm text-slate-600 mt-1">{visit.notes}</p>
				</li>
			))}
		</ol>
	);
}

