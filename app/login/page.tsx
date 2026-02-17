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

			if (!user) {
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
		<div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
			<div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm transition-colors duration-300">
				<h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">Restaurant Login</h2>

				{error && (
					<div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 p-2 mb-4 rounded transition-colors duration-300">
						{error}
					</div>
				)}

				<input
					className="border border-gray-300 dark:border-gray-600 p-3 mb-4 w-full rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-colors duration-300"
					placeholder="Email"
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					onKeyDown={handleKeyPress}
				/>

				<input
					className="border border-gray-300 dark:border-gray-600 p-3 mb-4 w-full rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-colors duration-300"
					type="password"
					placeholder="Password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					onKeyDown={handleKeyPress}
				/>

				<button
					onClick={handleLogin}
					disabled={loading}
					className="bg-blue-600 dark:bg-blue-500 text-white font-semibold px-4 py-3 w-full rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300">
					{loading ? "Logging in..." : "Login"}
				</button>
			</div>
		</div>
	);
}
