"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type SquareLocation = {
	id: string;
	name: string;
	isSelected?: boolean;
};

export default function SquareConnectButton() {
	const searchParams = useSearchParams();
	const code = searchParams.get("code");

	const [isConnecting, setIsConnecting] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [locations, setLocations] = useState<SquareLocation[]>([]);
	const [selectedLocation, setSelectedLocation] = useState("");
	const [loadingLocations, setLoadingLocations] = useState(false);

	/** Check if already connected on mount */
	useEffect(() => {
		const checkConnection = async () => {
			try {
				const res = await apiFetch("/square/locations");

				if (res.ok) {
					const data: SquareLocation[] = await res.json();
					if (data.length > 0) {
						setLocations(data);
						setIsConnected(true);

						const selected = data.find(l => l.isSelected);
						if (selected) setSelectedLocation(selected.id);
					}
				}
			} catch (err) {
				console.error("Error checking Square connection:", err);
			}
		};

		checkConnection();
	}, []);

	/** Exchange OAuth code for access token */
	useEffect(() => {
		if (!code) return;

		const exchange = async () => {
			setIsConnecting(true);
			try {
				const res = await fetch("/api/square-exchange", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ code }),
				});
				const data = await res.json();
				console.log("Square auth saved:", data);

				setIsConnected(true);
				fetchLocations();
				window.history.replaceState({}, document.title, "/admin/pos");
			} catch (err) {
				console.error(err);
			} finally {
				setIsConnecting(false);
			}
		};

		exchange();
	}, [code]);

	/** Fetch locations after auth */
	const fetchLocations = async () => {
		setLoadingLocations(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/square/locations`, {
				credentials: "include",
			});

			if (!res.ok) throw new Error("Failed to fetch locations");

			const data: SquareLocation[] = await res.json();
			setLocations(data);

			const selected = data.find(l => l.isSelected);
			if (selected) setSelectedLocation(selected.id);
		} catch (err) {
			console.error(err);
		} finally {
			setLoadingLocations(false);
		}
	};

	/** Save selected location */
	const handleSaveLocation = async () => {
		const location = locations.find(l => l.id === selectedLocation);
		if (!location) return;

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/square/select-location`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ locationId: location.id }),
			});

			if (!res.ok) throw new Error("Failed to save location");

			alert(`Location saved: ${location.name}`);
			fetchLocations();
		} catch (err) {
			console.error(err);
		}
	};

	/** Start OAuth flow */
	const handleConnect = () => {
		const clientId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
		const squareAuthBaseUrl = `${process.env.NEXT_PUBLIC_SQUARE_BASE_URL}/oauth2/authorize`;
		const redirectUri = `${window.location.origin}/admin/pos`;

		const squareAuthUrl =
			`${squareAuthBaseUrl}?client_id=${clientId}` +
			`&response_type=code` +
			`&scope=PAYMENTS_READ+PAYMENTS_WRITE+ORDERS_READ+ORDERS_WRITE+ITEMS_READ+ITEMS_WRITE+CUSTOMERS_READ+CUSTOMERS_WRITE` +
			`&redirect_uri=${encodeURIComponent(redirectUri)}`;

		window.open(squareAuthUrl, "_top");
	};

	/** UI */
	if (!isConnected) {
		return (
			<button
				onClick={handleConnect}
				disabled={isConnecting}
				className={`px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors ${
					isConnecting ? "opacity-50 cursor-not-allowed" : ""
				}`}>
				{isConnecting ? "Connecting..." : "Connect to Square"}
			</button>
		);
	}

	const currentLocation = locations.find(l => l.id === selectedLocation);

	return (
		<div className="flex flex-col gap-4 w-full max-w-sm">
			{/* Connected Badge with selected location */}
			<div className="flex items-center gap-2 text-green-600 font-semibold">
				✓ Square Connected
				{currentLocation && (
					<span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">{currentLocation.name}</span>
				)}
			</div>

			{loadingLocations ? (
				<div>Loading locations...</div>
			) : locations.length > 0 ? (
				<>
					<select
						value={selectedLocation}
						onChange={e => setSelectedLocation(e.target.value)}
						className="border rounded p-2 w-full">
						<option value="">Select Location</option>
						{locations.map(loc => (
							<option key={loc.id} value={loc.id}>
								{loc.name}
							</option>
						))}
					</select>

					<button
						onClick={handleSaveLocation}
						disabled={!selectedLocation}
						className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
						Save Location
					</button>
				</>
			) : (
				<div>No locations found.</div>
			)}
		</div>
	);
}
