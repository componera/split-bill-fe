import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@shadcn/ui";

export const metadata = {
	title: "Bill Splitting SaaS",
	description: "Multi-tenant restaurant bill splitting app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<ThemeProvider attribute="class">{children}</ThemeProvider>
			</body>
		</html>
	);
}
