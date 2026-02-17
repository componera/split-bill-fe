"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth"; // adjust path if different

export default function HomePage() {
	const router = useRouter();
	const { user } = useAuth(); // get current user

	useEffect(() => {
		if (user) {
			router.replace("/admin/dashboard");
		} else {
			router.replace("/login");
		}
	}, [user, router]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
			<Image src="/divvy-tab-logo.png" alt="DivvyTab Logo" width={200} priority />
		</div>
	);
}
