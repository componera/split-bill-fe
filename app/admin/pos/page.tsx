"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SquareConnectButton from "@/components/SquareConnectButton";

export default function AdminPosPage() {
	const searchParams = useSearchParams();
	const code = searchParams.get("code");
	const [status, setStatus] = useState<"idle" | "loading" | "connected" | "error">("idle");

	useEffect(() => {
		if (!code) return;

		// wrap in microtask to avoid synchronous state update warning
		(async () => {
			setStatus("loading");

			try {
				const res = await fetch("/api/square-exchange", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ code }),
				});
				const data = await res.json();

				if (data.error) {
					console.error("Square auth error:", data);
					setStatus("error");
				} else {
					console.log("Square auth saved:", data);
					setStatus("connected");

					// Remove code from URL
					window.history.replaceState({}, document.title, "/admin/pos");
				}
			} catch (err) {
				console.error(err);
				setStatus("error");
			}
		})();
	}, [code]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white dark:bg-black p-8">
			<h1 className="text-2xl font-bold">POS Integration</h1>

			{status === "connected" ? (
				<div className="text-green-600 font-semibold">✅ Connected to Square!</div>
			) : status === "loading" ? (
				<div className="text-gray-600 font-medium">Connecting to Square...</div>
			) : status === "error" ? (
				<div className="text-red-600 font-medium">Failed to connect. Please try again.</div>
			) : (
				<SquareConnectButton />
			)}
		</div>
	);
}
