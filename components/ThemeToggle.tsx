"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	return (
		<button onClick={toggleTheme} className="px-3 py-2 rounded-lg border border-border bg-muted hover:bg-accent transition-colors">
			{resolvedTheme === "dark" ? "☀ Light" : "🌙 Dark"}
		</button>
	);
}
