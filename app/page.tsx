"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth"; // adjust path if different

export default function HomePage() {
	const router = useRouter();
	const { user } = useAuth();

	// Redirect logged-in users to dashboard
	useEffect(() => {
		if (user) {
			router.replace("/admin/dashboard");
		}
	}, [user, router]);

	const handleLogin = () => {
		router.push("/login");
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black gap-8">
			{/* Logo */}
			<Image src="/divvy-tab-logo.png" alt="DivvyTab Logo" width={200} height={80} priority />

			{/* Login button only if not logged in */}
			{!user && (
				<button
					onClick={handleLogin}
					className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
					Login
				</button>
			)}
		</div>
	);
}
