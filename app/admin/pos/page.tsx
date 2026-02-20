"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SelectSquareLocation from "@/components/SelectSquareLocation";
import { SquareLocation } from "@/types/square";

export default function AdminPosPage() {
	const searchParams = useSearchParams();
	const code = searchParams.get("code");

	const [locations, setLocations] = useState<SquareLocation[] | null>(null);
	const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

	useEffect(() => {
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

				setLocations(data.locations || []);
				setStatus("idle");

				// Clean URL
				window.history.replaceState({}, document.title, "/admin/pos");
			} catch (err) {
				console.error(err);
				setStatus("error");
			}
		};

		exchangeCode();
	}, [code]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
			<h1 className="text-2xl font-bold">POS Integration</h1>

			{status === "loading" && <div>Connecting to Square...</div>}
			{status === "error" && <div className="text-red-600">Failed to connect. Please try again.</div>}

			{locations && locations.length > 0 && <SelectSquareLocation locations={locations} />}
			{!locations && status === "idle" && <div>Click the button below to connect Square.</div>}
		</div>
	);
}
