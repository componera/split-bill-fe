"use client";

import { useState } from "react";

export default function SquareConnectButton() {
	const [isConnecting, setIsConnecting] = useState(false);

	const handleConnect = () => {
		const clientId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
		const squareAuthBaseUrl = `${process.env.NEXT_PUBLIC_SQUARE_BASE_URL}/oauth2/authorize`;
		const redirectUri = `${window.location.origin}/admin/pos`;
		const scope = [
			"PAYMENTS_READ",
			"PAYMENTS_WRITE",
			"ORDERS_READ",
			"ORDERS_WRITE",
			"ITEMS_READ",
			"ITEMS_WRITE",
			"CUSTOMERS_READ",
			"CUSTOMERS_WRITE",
		].join(" ");

		const url =
			`${squareAuthBaseUrl}` +
			`?client_id=${clientId}` +
			`&response_type=code` +
			`&scope=${encodeURIComponent(scope)}` +
			`&redirect_uri=${encodeURIComponent(redirectUri)}`;

		setIsConnecting(true);
		window.location.href = url;
	};

	return (
		<button
			onClick={handleConnect}
			disabled={isConnecting}
			className={`px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors ${
				isConnecting ? "cursor-not-allowed opacity-70" : ""
			}`}>
			{isConnecting ? "Connecting..." : "Connect to Square"}
		</button>
	);
}
