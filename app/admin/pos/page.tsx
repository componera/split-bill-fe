"use client";

import SquareConnectButton from "@/components/SquareConnectButton";

/**
 * Admin POS page - allows restaurant owners/managers to connect their Square account.
 * Provides a button that initiates the OAuth flow with Square.
 */
export default function AdminPosPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white dark:bg-black p-8">
			<h1 className="text-2xl font-bold">POS Integration</h1>
			<SquareConnectButton />
		</div>
	);
}
