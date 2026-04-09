import { useState } from "react";

import { api } from "../../services/api.js";

/**
 * AI notes formatter tool page.
 * @returns {JSX.Element}
 */
export default function NotesFormatter() {
	const [rawNotes, setRawNotes] = useState("");
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);

	const format = async () => {
		setLoading(true);
		try {
			const response = await api.post("/ai/format-notes", { rawNotes });
			setResult(response.data?.data || null);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="space-y-4">
			<div className="rounded-lg border border-slate-200 bg-white p-4">
				<h2 className="text-lg font-semibold mb-3">Doctor Notes Formatter</h2>
				<textarea
					rows={8}
					className="w-full rounded-md border border-slate-300 px-3 py-2"
					placeholder="Paste raw notes here"
					value={rawNotes}
					onChange={(e) => setRawNotes(e.target.value)}
				/>
				<button type="button" onClick={format} disabled={loading || !rawNotes.trim()} className="mt-3 rounded-md bg-sky-700 px-4 py-2 text-white disabled:opacity-50">
					{loading ? "Formatting..." : "Format Notes"}
				</button>
			</div>

			<div className="rounded-lg border border-slate-200 bg-white p-4">
				<h3 className="text-base font-semibold mb-2">Structured Output</h3>
				<pre className="whitespace-pre-wrap text-sm text-slate-700">{result ? JSON.stringify(result, null, 2) : "No output yet."}</pre>
			</div>
		</section>
	);
}

