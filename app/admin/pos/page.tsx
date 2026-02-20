"use client";

import { useEffect, useState } from "react";
import SquareConnectButton from "@/components/SquareConnectButton";
import SelectSquareLocation, { SquareLocation } from "@/components/SelectSquareLocation";

export default function AdminPosPage() {
	const [status, setStatus] = useState<"idle" | "loading" | "connected" | "error">("idle");
	const [locations, setLocations] = useState<SquareLocation[] | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get("code");
		if (!code) return;

		const exchangeCode = async () => {
			setStatus("loading");
			try {
				const res = await fetch("/api/square-exchange", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ code }),
				});
				const data = await res.json();
				if (!res.ok || data.error) {
					console.error("Square auth error:", data);
					setStatus("error");
					return;
				}

				setLocations(data.locations ?? []);
				setStatus("connected");
				window.history.replaceState({}, document.title, "/admin/pos");
			} catch (err) {
				console.error(err);
				setStatus("error");
			}
		};

		exchangeCode();
	}, []);

	const selectLocation = async (locationId: string) => {
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/square/select-location`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ locationId }),
			});
			if (!res.ok) throw new Error("Failed to save location");

			setLocations(prev => prev?.map(loc => ({ ...loc, isSelected: loc.id === locationId })) ?? null);
		} catch (err) {
			console.error(err);
			alert("Failed to select location. Try again.");
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
			<h1 className="text-2xl font-bold">POS Integration</h1>

			{status === "loading" && <div>Connecting to Square...</div>}
			{status === "error" && <div className="text-red-600">Failed to connect. Please try again.</div>}
			{status === "idle" && (
				<>
					<div>Click the button below to connect Square.</div>
					<SquareConnectButton />
				</>
			)}
			{locations && locations.length > 0 && <SelectSquareLocation locations={locations} onSelect={selectLocation} />}
		</div>
	);
}
