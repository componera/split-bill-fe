"use client";

import React from "react";

export interface SquareLocation {
	id: string;
	name: string;
	isSelected: boolean;
}

interface SelectSquareLocationProps {
	locations: SquareLocation[];
	onSelect: (locationId: string) => void;
}

/**
 * Displays a list of Square locations for selection
 */
export default function SelectSquareLocation({ locations, onSelect }: SelectSquareLocationProps) {
	if (!locations || locations.length === 0) return null;

	return (
		<div className="flex flex-col gap-4 w-full max-w-md">
			<h2 className="font-semibold text-lg">Select a location:</h2>
			{locations.map(loc => (
				<button
					key={loc.id}
					onClick={() => onSelect(loc.id)}
					className={`p-3 rounded border transition-colors ${
						loc.isSelected
							? "bg-green-500 text-white border-green-600"
							: "bg-white text-black border-gray-300 hover:bg-gray-100"
					}`}>
					{loc.name} {loc.isSelected && "✅"}
				</button>
			))}
		</div>
	);
}
