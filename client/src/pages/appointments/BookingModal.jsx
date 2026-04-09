import { useMemo, useState } from "react";

import SlotPicker from "../../components/appointments/SlotPicker.jsx";
import { useCreateAppointment } from "../../hooks/useAppointments.js";
import { useDoctors, useDoctorSlots } from "../../hooks/useDoctors.js";

/**
 * Appointment booking page with step flow.
 * @returns {JSX.Element}
 */
export default function BookingModal() {
	const doctorsQuery = useDoctors();
	const createMutation = useCreateAppointment();

	const [doctorId, setDoctorId] = useState("");
	const [patientId, setPatientId] = useState("");
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
	const [slotTime, setSlotTime] = useState("");

	const slotsQuery = useDoctorSlots(doctorId, date);
	const slots = slotsQuery.data || [];

	const selectedDoctor = useMemo(
		() => (doctorsQuery.data || []).find((doctor) => doctor._id === doctorId),
		[doctorsQuery.data, doctorId],
	);

	const onConfirm = async () => {
		if (!doctorId || !date || !slotTime || !patientId) return;
		await createMutation.mutateAsync({
			patientId,
			doctorId,
			date,
			slotTime,
			status: "booked",
			bookedVia: "dashboard",
			reminderSent: false,
			followUpSent: false,
			notes: "",
		});
		setSlotTime("");
	};

	return (
		<section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
			<h2 className="text-lg font-semibold">Book Appointment</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<input className="rounded border px-3 py-2" placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
				<select className="rounded border px-3 py-2" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
					<option value="">Select doctor</option>
					{(doctorsQuery.data || []).map((doctor) => (
						<option key={doctor._id} value={doctor._id}>{doctor.name}</option>
					))}
				</select>
				<input type="date" className="rounded border px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
			</div>

			{selectedDoctor && (
				<div className="rounded border border-slate-200 p-3">
					<p className="text-sm text-slate-600 mb-2">Choose slot for {selectedDoctor.name}</p>
					<SlotPicker slots={slots} selected={slotTime} onSelect={setSlotTime} />
				</div>
			)}

			<button type="button" className="rounded bg-sky-700 px-4 py-2 text-white disabled:opacity-50" onClick={onConfirm} disabled={!slotTime || createMutation.isPending}>
				Confirm Booking
			</button>
		</section>
	);
}

