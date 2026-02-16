import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export const metadata = {
	title: "Bill Splitting SaaS",
	description: "Multi-tenant restaurant bill splitting app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className="dark">
			<body>
				<ThemeProvider attribute="class">{children}</ThemeProvider>
			</body>
		</html>
	);
}
