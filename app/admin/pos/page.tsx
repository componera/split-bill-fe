"use client";

import { useEffect, useState } from "react";
import SquareConnectButton from "@/components/SquareConnectButton";
import SelectSquareLocation from "@/components/SelectSquareLocation";

interface SquareLocation {
	id: string;
	name: string;
	isSelected: boolean;
}

export default function AdminPosPage() {
	const [status, setStatus] = useState<"idle" | "loading" | "connected" | "error">("idle");
	const [locations, setLocations] = useState<SquareLocation[] | null>(null);

	// Read code from query string (Square OAuth redirect)
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get("code");
		if (!code) return;

		const exchangeCode = async () => {
			setStatus("loading");
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/square/exchange`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include", // cookies for backend auth
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

				// Clean URL so code param disappears
				window.history.replaceState({}, document.title, "/admin/pos");
			} catch (err) {
				console.error("Square exchange failed:", err);
				setStatus("error");
			}
		};

		exchangeCode();
	}, []);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
			<h1 className="text-2xl font-bold">POS Integration</h1>

			{status === "loading" && <div>Connecting to Square...</div>}
			{status === "error" && <div className="text-red-600">Failed to connect. Please try again.</div>}

			{locations && locations.length > 0 && <SelectSquareLocation locations={locations} />}

			{!locations && status === "idle" && (
				<>
					<div>Click the button below to connect Square.</div>
					<SquareConnectButton />
				</>
			)}
		</div>
	);
}
