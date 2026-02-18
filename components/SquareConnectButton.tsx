"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SquareConnectButton() {
	const searchParams = useSearchParams();
	const code = searchParams.get("code");

	useEffect(() => {
		if (code) {
			// Exchange code for access token
			fetch("/api/square-exchange", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code }),
			})
				.then(res => res.json())
				.then(data => console.log("Square auth saved:", data))
				.catch(err => console.error(err));
		}
	}, [code]);

	const handleConnect = () => {
		const clientId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
		const redirectUri = `${window.location.origin}/`; // redirect back to homepage
		const squareAuthUrl = `https://connect.squareupsandbox.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=PAYMENTS_READ+PAYMENTS_WRITE&redirect_uri=${encodeURIComponent(redirectUri)}`;
		window.location.href = squareAuthUrl;
	};

	return (
		<button
			onClick={handleConnect}
			className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">
			Connect to Square
		</button>
	);
}
