"use client";

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

let socket: Socket;

interface User {
	id: string;
	email: string;
	role: string;
}

interface Invite {
	id: string;
	email: string;
	expiresAt: string;
}

export default function StaffPage() {
	const [email, setEmail] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const [invites, setInvites] = useState<Invite[]>([]);
	const [loading, setLoading] = useState(false);

	const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

	useEffect(() => {
		// Wrap the async logic inside the effect itself
		const fetchData = async () => {
			const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
			if (!token) return;

			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			setUsers(data.users);
			setInvites(data.invites);
		};

		fetchData();
	}, []); // Only runs once

	const inviteStaff = async () => {
		setLoading(true);
		const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
		if (!token) return;

		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/invite`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		setEmail("");

		// Refresh staff/invite list after invite
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const data = await res.json();
		setUsers(data.users);
		setInvites(data.invites);

		setLoading(false);
	};

	const revokeInvite = async (id: string) => {
		const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
		if (!token) return;

		// Delete the invite
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/invite/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		// Reload staff and invites safely
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const data = await res.json();

		// Update state
		setUsers(data.users);
		setInvites(data.invites);
	};

	const resendInvite = async (inviteId: string) => {
		if (!token) return;

		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/resend`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ inviteId }),
		});

		alert("Invite resent");
	};

	return (
		<div className="p-6 max-w-5xl mx-auto space-y-8">
			<h1 className="text-3xl font-bold">Staff Management</h1>

			<Card>
				<CardContent className="p-6 space-y-4">
					<h2 className="text-xl font-semibold">Invite Staff Member</h2>

					<div className="flex gap-3">
						<Input placeholder="Enter staff email" value={email} onChange={e => setEmail(e.target.value)} />
						<Button onClick={inviteStaff} disabled={loading || !email}>
							{loading ? "Sending..." : "Send Invite"}
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="p-6">
					<h2 className="text-xl font-semibold mb-4">Active Staff</h2>

					{users.map(user => (
						<div key={user.id} className="flex justify-between py-2 border-b">
							<span>{user.email}</span>
							<span className="text-sm text-gray-500">{user.role}</span>
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardContent className="p-6">
					<h2 className="text-xl font-semibold mb-4">Pending Invites</h2>

					{invites.map(invite => (
						<div key={invite.id} className="flex justify-between items-center py-2 border-b">
							<div>
								<p>{invite.email}</p>
								<p className="text-sm text-gray-500">Expires: {new Date(invite.expiresAt).toLocaleDateString()}</p>
							</div>

							<div className="flex gap-2">
								<Button variant="outline" onClick={() => resendInvite(invite.id)}>
									Resend
								</Button>

								<Button variant="destructive" onClick={() => revokeInvite(invite.id)}>
									Revoke
								</Button>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
