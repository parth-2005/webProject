import { Link, useParams } from "react-router-dom";

import VisitHistoryTimeline from "../../components/patients/VisitHistoryTimeline.jsx";
import { usePatient } from "../../hooks/usePatients.js";
import { formatPhone } from "../../utils/formatters.js";

/**
 * Patient detail page.
 * @returns {JSX.Element}
 */
export default function PatientDetail() {
	const { id } = useParams();
	const query = usePatient(id);

	if (query.isLoading) return <p>Loading...</p>;
	const patient = query.data;
	if (!patient) return <p>Patient not found.</p>;

	return (
		<section className="space-y-4">
			<div className="rounded-lg border border-slate-200 bg-white p-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">{patient.name}</h2>
					<Link to={`/patients/${patient._id}/edit`} className="rounded border px-3 py-1 text-sm">Edit</Link>
				</div>
				<div className="mt-3 grid grid-cols-2 gap-2 text-sm">
					<p><span className="text-slate-500">Phone:</span> {formatPhone(patient.phone)}</p>
					<p><span className="text-slate-500">Age:</span> {patient.age}</p>
					<p><span className="text-slate-500">Gender:</span> {patient.gender}</p>
					<p><span className="text-slate-500">Blood Group:</span> {patient.bloodGroup}</p>
				</div>
			</div>

			<div className="rounded-lg border border-slate-200 bg-white p-4">
				<h3 className="text-base font-semibold mb-3">Visit History</h3>
				<VisitHistoryTimeline visits={patient.visitHistory || []} />
			</div>
		</section>
	);
}

