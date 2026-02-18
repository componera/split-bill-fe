"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPosPage() {
	const router = useRouter();
	const { user } = useAuth(); // your auth hook
	const [isConnecting, setIsConnecting] = useState(false);

	useEffect(() => {
		if (!user) {
			router.replace("/login"); // optional: redirect if not logged in
		}
	}, [user, router]);

	const handleConnectSquare = () => {
		const clientId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
		const redirectUri = `${window.location.origin}/admin/pos`; // redirect back here
		const scope = encodeURIComponent(
			"PAYMENTS_READ PAYMENTS_WRITE ORDERS_READ ORDERS_WRITE CUSTOMERS_READ CUSTOMERS_WRITE ITEMS_READ ITEMS_WRITE",
		); // add more scopes if needed
		const squareAuthUrl = `https://connect.squareup.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}`;

		setIsConnecting(true);
		window.location.href = squareAuthUrl;
	};

	// Check if Square redirected back with code
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");

		if (code && user) {
			setIsConnecting(true);
			fetch("/api/square-exchange", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code }),
			})
				.then(res => res.json())
				.then(data => {
					console.log("Square auth saved:", data);
					setIsConnecting(false);
					// Optionally remove code from URL
					window.history.replaceState({}, document.title, "/admin/pos");
				})
				.catch(err => {
					console.error(err);
					setIsConnecting(false);
				});
		}
	}, [user]);

	if (!user) return null; // optional: blank while redirecting

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white dark:bg-black p-8">
			<Image src="/divvy-tab-logo.png" alt="DivvyTab Logo" width={200} height={80} priority />

			<button
				onClick={handleConnectSquare}
				disabled={isConnecting}
				className={`px-6 py-3 rounded-lg font-semibold transition-colors
          ${isConnecting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}>
				{isConnecting ? "Connecting..." : "Connect to Square"}
			</button>
		</div>
	);
}
