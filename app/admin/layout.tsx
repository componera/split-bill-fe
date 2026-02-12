"use client";

import AuthGuard from "@/components/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGuard allowedRoles={["OWNER", "MANAGER"]}>
			<div className="min-h-screen bg-gray-100">{children}</div>
		</AuthGuard>
	);
}
