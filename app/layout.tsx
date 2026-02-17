import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "../components/ThemeProvider";

export const metadata = {
	title: "Bill Splitting SaaS",
	description: "Multi-tenant restaurant bill splitting app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
