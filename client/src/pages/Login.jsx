import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/auth.api.js";
import { useAuthStore } from "../store/authStore.js";

const schema = z.object({
	email: z.string().email("Enter a valid email"),
	password: z.string().min(1, "Password is required"),
});

/**
 * Login page.
 * @returns {JSX.Element}
 */
export default function Login() {
	const navigate = useNavigate();
	const setAuth = useAuthStore((state) => state.setAuth);
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const onSubmit = async (event) => {
		event.preventDefault();
		const parsed = schema.safeParse(form);
		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message || "Invalid input");
			return;
		}

		setLoading(true);
		setError("");
		try {
			const data = await login(parsed.data);
			setAuth({ user: data.user, token: data.accessToken });
			navigate("/dashboard");
		} catch (err) {
			setError(err?.response?.data?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<form onSubmit={onSubmit} className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow">
				<h1 className="text-xl font-semibold mb-4">Hospital AI Login</h1>
				<div className="space-y-3">
					<input
						className="w-full rounded-md border border-slate-300 px-3 py-2"
						placeholder="Email"
						value={form.email}
						onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
					/>
					<input
						type="password"
						className="w-full rounded-md border border-slate-300 px-3 py-2"
						placeholder="Password"
						value={form.password}
						onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
					/>
				</div>
				{error && <p className="text-sm text-red-600 mt-3">{error}</p>}
				<button type="submit" disabled={loading} className="mt-4 w-full rounded-md bg-sky-600 px-3 py-2 text-white disabled:opacity-50">
					{loading ? "Signing in..." : "Sign In"}
				</button>
			</form>
		</div>
	);
}

