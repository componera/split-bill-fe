"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SquareConnectButton() {
	const searchParams = useSearchParams();
	const code = searchParams.get("code");

	useEffect(() => {
		if (!code) return;

		const exchange = async () => {
			try {
				const res = await fetch("/api/square-exchange", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ code }),
				});

				const data = await res.json();
				console.log("Square auth saved:", data);

				// Optional: remove ?code from URL after exchange
				window.history.replaceState({}, document.title, "/admin/pos");
			} catch (err) {
				console.error(err);
			}
		};

		exchange();
	}, [code]);

	const handleConnect = () => {
		const clientId = process.env.NEXT_PUBLIC_SQUARE_APP_ID!;
		const squareAuthBaseUrl = process.env.NEXT_PUBLIC_SQUARE_BASE_URL!;
		const redirectUri = `${window.location.origin}/admin/pos`;

		const squareAuthUrl =
			`${squareAuthBaseUrl}/oauth2/authorize` +
			`?client_id=${clientId}` +
			`&response_type=code` +
			`&scope=PAYMENTS_READ+PAYMENTS_WRITE` +
			`&redirect_uri=${encodeURIComponent(redirectUri)}`;

		window.location.href = squareAuthUrl;
	};

	return (
		<button
			onClick={handleConnect}
			className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
			Connect to Square
		</button>
	);
}
