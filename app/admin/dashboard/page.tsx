"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboard() {
	const { user, logout } = useAuth();
	const [stats, setStats] = useState<any>(null);

	const fetchStats = async () => {
		const res = await apiFetch("/admin/stats");
		if (!res.ok) throw new Error("Failed to fetch stats");
		const data = await res.json();
		setStats(data);
	};

	useEffect(() => {
		fetchStats();

		const socket = getSocket();
		socket.emit("joinRestaurant", { restaurantId: user.restaurantId });

		socket.on("bill.created", fetchStats);
		socket.on("bill.updated", fetchStats);
		socket.on("payment.completed", fetchStats);

		return () => {
			socket.off("bill.created", fetchStats);
			socket.off("bill.updated", fetchStats);
			socket.off("payment.completed", fetchStats);
		};
	}, []);

	if (!user) return null;

	return (
		<div className="p-6">
			<h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
			{stats ? (
				<div className="grid grid-cols-3 gap-6">
					<div className="bg-white p-4 rounded shadow">
						<h2 className="text-lg font-semibold">Active Bills</h2>
						<p className="text-2xl">{stats.activeBills}</p>
					</div>
					<div className="bg-white p-4 rounded shadow">
						<h2 className="text-lg font-semibold">Payments Today</h2>
						<p className="text-2xl">{stats.paymentsToday}</p>
					</div>
					<div className="bg-white p-4 rounded shadow">
						<h2 className="text-lg font-semibold">Revenue Today</h2>
						<p className="text-2xl">R {stats.revenueToday}</p>
					</div>
				</div>
			) : (
				<p>Loading stats...</p>
			)}
			<button className="mt-6 bg-red-600 text-white px-4 py-2 rounded" onClick={logout}>
				Logout
			</button>
		</div>
	);
}
