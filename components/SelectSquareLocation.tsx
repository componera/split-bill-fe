"use client";

import { useState } from "react";

interface SquareLocation {
	id: string;
	name: string;
	isSelected: boolean;
}

interface SelectSquareLocationProps {
	locations: SquareLocation[];
}

/**
 * Component to select a Square location for the restaurant.
 * Updates backend on selection and reflects the current selected location.
 */
export default function SelectSquareLocation({ locations }: SelectSquareLocationProps) {
	const [selectedId, setSelectedId] = useState<string | null>(locations.find(l => l.isSelected)?.id ?? null);
	const [loading, setLoading] = useState(false);

	const handleSelect = async (id: string) => {
		setLoading(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/square/select-location`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ locationId: id }),
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({ message: "Failed to select location" }));
				throw new Error(err.message || "Failed to select location");
			}

			setSelectedId(id);
		} catch (err) {
			console.error("Error selecting Square location:", err);
			alert("Failed to select location. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-2 w-full max-w-md">
			<h2 className="font-semibold text-lg">Select your Square location:</h2>
			{locations.map(loc => (
				<button
					key={loc.id}
					className={`px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
						selectedId === loc.id
							? "bg-blue-500 text-white border-blue-500"
							: "bg-white dark:bg-black border-gray-300 dark:border-gray-700"
					}`}
					onClick={() => handleSelect(loc.id)}
					disabled={loading || selectedId === loc.id}>
					{loc.name} {selectedId === loc.id ? "(Selected)" : ""}
				</button>
			))}
		</div>
	);
}
