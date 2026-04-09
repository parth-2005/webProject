import { useState } from "react";
import { Link } from "react-router-dom";

import { usePatients } from "../../hooks/usePatients.js";
import { formatDate, formatPhone } from "../../utils/formatters.js";

/**
 * Patient list page.
 * @returns {JSX.Element}
 */
export default function PatientList() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const query = usePatients({ search, page, limit: 10 });

	const data = query.data || { patients: [], pages: 1 };

	return (
		<section className="space-y-4">
			<div className="flex items-center justify-between gap-2">
				<input
					className="w-full md:max-w-sm rounded-md border border-slate-300 px-3 py-2"
					placeholder="Search by name or phone"
					value={search}
					onChange={(e) => {
						setPage(1);
						setSearch(e.target.value);
					}}
				/>
				<Link to="/patients/new" className="rounded-md bg-sky-700 px-3 py-2 text-white text-sm">Add Patient</Link>
			</div>

			<div className="overflow-auto rounded-lg border border-slate-200 bg-white">
				<table className="w-full text-sm">
					<thead className="bg-slate-50 text-left">
						<tr>
							<th className="px-3 py-2">Name</th>
							<th className="px-3 py-2">Phone</th>
							<th className="px-3 py-2">Gender</th>
							<th className="px-3 py-2">Created</th>
						</tr>
					</thead>
					<tbody>
						{(data.patients || []).map((patient) => (
							<tr key={patient._id} className="border-t border-slate-100 hover:bg-slate-50">
								<td className="px-3 py-2"><Link className="text-sky-700" to={`/patients/${patient._id}`}>{patient.name}</Link></td>
								<td className="px-3 py-2">{formatPhone(patient.phone)}</td>
								<td className="px-3 py-2">{patient.gender}</td>
								<td className="px-3 py-2">{formatDate(patient.createdAt)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex items-center gap-2">
				<button type="button" className="rounded border px-3 py-1" disabled={page <= 1} onClick={() => setPage((v) => v - 1)}>Prev</button>
				<span className="text-sm">Page {page} / {data.pages || 1}</span>
				<button type="button" className="rounded border px-3 py-1" disabled={page >= (data.pages || 1)} onClick={() => setPage((v) => v + 1)}>Next</button>
			</div>
		</section>
	);
}

