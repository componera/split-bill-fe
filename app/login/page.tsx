"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
	const { login, user } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async () => {
		setLoading(true);
		setError(null);

		try {
			await login(email, password);

			// Redirect based on role
			if (!user) {
				// fallback if user not yet loaded
				window.location.href = "/dashboard";
				return;
			}

			switch (user.role) {
				case "OWNER":
				case "MANAGER":
					window.location.href = "/admin/dashboard";
					break;
				case "STAFF":
					window.location.href = "/dashboard";
					break;
				default:
					window.location.href = "/dashboard";
			}
		} catch (err: any) {
			setError(err.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleLogin();
	};

	return (
		<div className="flex h-screen items-center justify-center bg-gray-50">
			<div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
				<h2 className="text-2xl font-semibold mb-6 text-center">Restaurant Login</h2>

				{error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

				<input
					className="border p-3 mb-4 w-full rounded"
					placeholder="Email"
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					onKeyDown={handleKeyPress}
				/>

				<input
					className="border p-3 mb-4 w-full rounded"
					type="password"
					placeholder="Password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					onKeyDown={handleKeyPress}
				/>

				<button
					onClick={handleLogin}
					disabled={loading}
					className="bg-blue-600 text-white font-semibold px-4 py-3 w-full rounded hover:bg-blue-700 transition">
					{loading ? "Logging in..." : "Login"}
				</button>
			</div>
		</div>
	);
}
