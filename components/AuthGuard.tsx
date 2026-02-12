"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";

export default function AuthGuard({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
	const router = useRouter();

	useEffect(() => {
		const user = getUser();

		if (!user) {
			router.push("/login");
			return;
		}

		if (allowedRoles && !allowedRoles.includes(user.role)) {
			router.push("/login");
		}
	}, []);

	return <>{children}</>;
}
