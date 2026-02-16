"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";

const menuItems = [
	{
		id: "dashboard",
		name: "Dashboard",
		href: "/admin/dashboard",
		icon: LayoutDashboard,
	},
	{
		id: "staff",
		name: "Staff",
		href: "/admin/staff",
		icon: Users,
	},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Sidebar */}
			<aside className="w-64 bg-white border-r">
				<div className="p-6 border-b font-bold text-lg">Admin Panel</div>

				<nav className="p-4 space-y-2">
					{menuItems.map(item => {
						const Icon = item.icon;
						const active = pathname === item.href;

						return (
							<Link
								key={item.id} // ✅ stable unique key
								href={item.href}
								className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
									active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
								}`}>
								<Icon size={18} />
								{item.name}
							</Link>
						);
					})}
				</nav>
			</aside>

			{/* Main */}
			<main className="flex-1 p-6">{children}</main>
		</div>
	);
}
