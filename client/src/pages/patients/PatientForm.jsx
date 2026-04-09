import { z } from "zod";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useCreatePatient, usePatient, useUpdatePatient } from "../../hooks/usePatients.js";

const schema = z.object({
	name: z.string().min(1),
	phone: z.string().min(6),
	age: z.coerce.number().int().min(0),
	gender: z.enum(["male", "female", "other"]),
	bloodGroup: z.string().min(1),
	address: z.string().min(1),
	telegramOptIn: z.boolean(),
	telegramChatId: z.string().optional().nullable(),
	visitHistory: z.array(z.any()).default([]),
});

/**
 * Patient create/edit form page.
 * @returns {JSX.Element}
 */
export default function PatientForm() {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEdit = Boolean(id);

	const detail = usePatient(id);
	const createMutation = useCreatePatient();
	const updateMutation = useUpdatePatient();

	const [error, setError] = useState("");

	const defaults = detail.data || {
		name: "",
		phone: "",
		age: 0,
		gender: "male",
		bloodGroup: "",
		address: "",
		telegramOptIn: true,
		telegramChatId: "",
		visitHistory: [],
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const payload = {
			name: formData.get("name") || "",
			phone: formData.get("phone") || "",
			age: Number(formData.get("age") || 0),
			gender: formData.get("gender") || "male",
			bloodGroup: formData.get("bloodGroup") || "",
			address: formData.get("address") || "",
			telegramOptIn: formData.get("telegramOptIn") === "on",
			telegramChatId: String(formData.get("telegramChatId") || "").trim() || null,
			visitHistory: defaults.visitHistory || [],
		};

		const parsed = schema.safeParse(payload);
		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message || "Invalid form");
			return;
		}

		setError("");
		if (isEdit) {
			await updateMutation.mutateAsync({ id, payload: parsed.data });
			navigate(`/patients/${id}`);
		} else {
			const created = await createMutation.mutateAsync(parsed.data);
			navigate(`/patients/${created._id}`);
		}
	};

	return (
		<form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
			<h2 className="text-lg font-semibold">{isEdit ? "Edit Patient" : "New Patient"}</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<input name="name" className="rounded-md border px-3 py-2" placeholder="Name" defaultValue={defaults.name} />
				<input name="phone" className="rounded-md border px-3 py-2" placeholder="Phone" defaultValue={defaults.phone} />
				<input name="age" type="number" className="rounded-md border px-3 py-2" placeholder="Age" defaultValue={defaults.age} />
				<select name="gender" className="rounded-md border px-3 py-2" defaultValue={defaults.gender || "male"}>
					<option value="male">male</option>
					<option value="female">female</option>
					<option value="other">other</option>
				</select>
				<input name="bloodGroup" className="rounded-md border px-3 py-2" placeholder="Blood Group" defaultValue={defaults.bloodGroup} />
				<input name="address" className="rounded-md border px-3 py-2" placeholder="Address" defaultValue={defaults.address} />
				<input name="telegramChatId" className="rounded-md border px-3 py-2" placeholder="Telegram Chat ID" defaultValue={defaults.telegramChatId || ""} />
			</div>
			<label className="inline-flex items-center gap-2 text-sm">
				<input name="telegramOptIn" type="checkbox" defaultChecked={Boolean(defaults.telegramOptIn)} />
				Telegram updates enabled
			</label>
			{error && <p className="text-sm text-red-600">{error}</p>}
			<button type="submit" className="rounded-md bg-sky-700 text-white px-4 py-2">Save</button>
		</form>
	);
}

