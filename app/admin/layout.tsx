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
		<div className="flex min-h-screen bg-gray-950 text-gray-100">
			{/* Sidebar */}
			<aside className="w-64 bg-gray-900 border-r border-gray-800">
				<div className="p-6 border-b border-gray-800 font-bold text-lg">Admin Panel</div>

				<nav className="p-4 space-y-2">
					{menuItems.map(item => {
						const Icon = item.icon;
						const active = pathname === item.href;

						return (
							<Link
								key={item.id}
								href={item.href}
								className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
									active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
								}`}>
								<Icon size={18} />
								{item.name}
							</Link>
						);
					})}
				</nav>
			</aside>

			{/* Main */}
			<main className="flex-1 bg-gray-950 p-6">{children}</main>
		</div>
	);
}
