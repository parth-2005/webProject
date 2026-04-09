import { useState } from "react";

import { useDoctors, useUpdateDoctorSchedule } from "../../hooks/useDoctors.js";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

/**
 * Doctor schedule configuration page.
 * @returns {JSX.Element}
 */
export default function ScheduleConfig() {
	const doctorsQuery = useDoctors();
	const updateMutation = useUpdateDoctorSchedule();
	const [doctorId, setDoctorId] = useState("");
	const [slot, setSlot] = useState("09:00");

	const [weeklySlots, setWeeklySlots] = useState(
		Object.fromEntries(days.map((day) => [day, []])),
	);

	const addSlot = (day) => {
		setWeeklySlots((state) => ({
			...state,
			[day]: [...state[day], { start: slot, end: slot }],
		}));
	};

	const save = async () => {
		if (!doctorId) return;
		await updateMutation.mutateAsync({
			doctorId,
			payload: { doctorId, weeklySlots, blockedDates: [] },
		});
	};

	return (
		<section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
			<h2 className="text-lg font-semibold">Schedule Configuration</h2>
			<div className="flex flex-wrap gap-2">
				<select className="rounded border px-3 py-2" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
					<option value="">Select doctor</option>
					{(doctorsQuery.data || []).map((doctor) => (
						<option key={doctor._id} value={doctor._id}>{doctor.name}</option>
					))}
				</select>
				<input className="rounded border px-3 py-2" value={slot} onChange={(e) => setSlot(e.target.value)} />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				{days.map((day) => (
					<div key={day} className="rounded border border-slate-200 p-3">
						<div className="flex items-center justify-between">
							<p className="capitalize font-medium">{day}</p>
							<button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => addSlot(day)}>Add Slot</button>
						</div>
						<ul className="mt-2 text-sm text-slate-600">
							{weeklySlots[day].map((item, idx) => <li key={`${day}-${idx}`}>{item.start}</li>)}
						</ul>
					</div>
				))}
			</div>

			<button type="button" className="rounded bg-sky-700 px-4 py-2 text-white" onClick={save}>Save Schedule</button>
		</section>
	);
}

