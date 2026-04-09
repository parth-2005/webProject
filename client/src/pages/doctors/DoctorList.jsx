import { useDoctors } from "../../hooks/useDoctors.js";

/**
 * Doctor list page.
 * @returns {JSX.Element}
 */
export default function DoctorList() {
	const query = useDoctors();
	const doctors = query.data || [];

	return (
		<section className="rounded-lg border border-slate-200 bg-white p-4">
			<h2 className="text-lg font-semibold mb-3">Doctors</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				{doctors.map((doctor) => (
					<div key={doctor._id} className="rounded border border-slate-200 p-3">
						<p className="font-medium">{doctor.name}</p>
						<p className="text-sm text-slate-600">{doctor.doctorProfile?.specialization || "-"}</p>
					</div>
				))}
			</div>
		</section>
	);
}

