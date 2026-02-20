"use client";

import { useState, useEffect } from "react";
import { SquareLocation } from "@/types/square";

interface Props {
	locations: SquareLocation[];
}

export default function SelectSquareLocation({ locations }: Props) {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const saveLocation = async () => {
		if (!selectedId) return;
		setSaving(true);
		setError(null);

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/square/select-location`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ locationId: selectedId }),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message || "Failed to save location");
			}

			alert("Location saved successfully!");
		} catch (err: any) {
			console.error(err);
			setError(err.message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">Select your Square Location</h2>
			<select className="border p-2 rounded" value={selectedId || ""} onChange={e => setSelectedId(e.target.value)}>
				<option value="" disabled>
					-- Choose a location --
				</option>
				{locations.map(loc => (
					<option key={loc.id} value={loc.id}>
						{loc.name} {loc.isSelected ? "(selected)" : ""}
					</option>
				))}
			</select>

			{error && <div className="text-red-600">{error}</div>}

			<button
				onClick={saveLocation}
				disabled={!selectedId || saving}
				className="bg-blue-600 text-white p-2 rounded disabled:opacity-50">
				{saving ? "Saving..." : "Save Location"}
			</button>
		</div>
	);
}
