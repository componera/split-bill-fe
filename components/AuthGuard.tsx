"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";

interface AuthGuardProps {
	children: React.ReactNode;
	allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		const checkAuth = async () => {
			const currentUser = await getUser(); // fetches from /auth/me
			if (!currentUser) {
				router.push("/login");
				return;
			}

			if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
				router.push("/login");
				return;
			}

			setUser(currentUser);
			setLoading(false);
		};

		checkAuth();
	}, [allowedRoles, router]);

	if (loading) return <div>Loading...</div>; // optional spinner

	return <>{children}</>;
}
