/**
 * Slot picker grid.
 * @param {{ slots: Array<{ start: string, end: string }>, selected: string, onSelect: (slot: string) => void }} props
 * @returns {JSX.Element}
 */
export default function SlotPicker({ slots, selected, onSelect }) {
	if (!slots?.length) return <p className="text-sm text-slate-500">No slots available.</p>;
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
			{slots.map((slot) => (
				<button
					key={slot.start}
					type="button"
					className={`rounded-md border px-3 py-2 text-sm ${selected === slot.start ? "border-sky-500 bg-sky-50" : "border-slate-300"}`}
					onClick={() => onSelect(slot.start)}
				>
					{slot.start}
				</button>
			))}
		</div>
	);
}

