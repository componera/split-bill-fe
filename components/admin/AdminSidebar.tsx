"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Terminal, Receipt, CreditCard, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const MENU_ITEMS = [
	{ id: "dashboard", name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
	{ id: "pos", name: "Connect POS", href: "/admin/pos", icon: Terminal },
	{ id: "staff", name: "Staff", href: "/admin/staff", icon: Users },
	{ id: "bills", name: "Bills", href: "/admin/bills", icon: Receipt },
	{ id: "payments", name: "Payments", href: "/admin/payments", icon: CreditCard },
];

/** Admin sidebar - nav links and logout. Fixed to viewport height. */
export default function AdminSidebar() {
	const pathname = usePathname();
	const { logout } = useAuth();

	return (
		<aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card/95 shadow-lg backdrop-blur-sm">
			<div className="border-b border-border bg-linear-to-r from-primary/10 to-transparent px-6 py-5 dark:from-primary/20">
				<h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
				<p className="mt-0.5 text-xs text-muted-foreground">Divvy Tab</p>
			</div>
			<nav className="flex-1 space-y-1 p-4">
				{MENU_ITEMS.map(({ id, name, href, icon: Icon }) => {
					const active = pathname === href;
					const linkClass = active
						? "bg-primary text-primary-foreground shadow-md"
						: "text-muted-foreground hover:bg-primary/10 hover:text-foreground";
					return (
						<Link
							key={id}
							href={href}
							className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 active:scale-[0.98] ${linkClass}`}>
							<Icon size={18} />
							<span className="font-medium">{name}</span>
						</Link>
					);
				})}
			</nav>
			<div className="border-t border-border p-4">
				<Button
					variant="outline"
					className="w-full justify-center gap-2 border-destructive/50 text-destructive hover:border-destructive hover:bg-destructive/10"
					onClick={logout}>
					<LogOut size={16} />
					Logout
				</Button>
			</div>
		</aside>
	);
}
