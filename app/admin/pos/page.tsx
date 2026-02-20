"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SquareConnectButton from "@/components/SquareConnectButton";

export default function AdminPosPage() {
	const searchParams = useSearchParams();
	const code = searchParams.get("code");
	const [status, setStatus] = useState<"idle" | "loading" | "connected" | "error">("idle");

	useEffect(() => {
		const exchangeCode = async () => {
			if (!code) return;

			setStatus("loading");

			try {
				const res = await fetch("/api/square-exchange", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include", // sends cookies
					body: JSON.stringify({ code }),
				});

				if (!res.ok) throw new Error("Failed to connect Square");

				// Optional: refresh access_token after redirect
				await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, { method: "POST", credentials: "include" });

				setStatus("connected");
				window.history.replaceState({}, document.title, "/admin/pos");
			} catch (err) {
				console.error(err);
				setStatus("error");
			}
		};

		exchangeCode();
	}, [code]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 bg-white dark:bg-black">
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
