"use client";

import { useEffect, useState } from "react";
import { fetchBill, payItems } from "@/lib/api";
import { useBillSocket } from "@/hooks/useBillSocket";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BillItem {
	id: string;
	name: string;
	price: number;
	paid: boolean;
}

interface Bill {
	id: string;
	items: BillItem[];
}

export default function BillPage({ params }: { params: { billId: string } }) {
	const billId = params.billId;
	const { user } = useAuth();
	const [bill, setBill] = useState<Bill | null>(null);
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const loadBill = async () => {
		const data = await fetchBill(billId);
		setBill(data);
	};

	useEffect(() => {
		loadBill();
	}, [billId]);

	// subscribe to real-time updates
	useBillSocket(billId, user.restaurantId, updatedBill => {
		setBill(updatedBill);
	});

	const toggleItem = (id: string) => {
		setSelectedItems(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]));
	};

	const handlePay = async () => {
		if (selectedItems.length === 0) return;
		setLoading(true);
		try {
			await payItems(billId, selectedItems);
			setSelectedItems([]);
			// bill updates automatically via socket
		} catch {
			alert("Payment failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (!bill) return <p>Loading bill...</p>;

	return (
		<div className="p-6 max-w-lg mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Your Bill</h1>

			{bill.items.map((item: BillItem) => (
				<Card key={item.id} className="mb-2">
					<CardContent className="flex justify-between items-center">
						<span className={item.paid ? "opacity-50" : ""}>
							{item.name} - R {item.price}
						</span>
						{!item.paid && (
							<input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleItem(item.id)} />
						)}
					</CardContent>
				</Card>
			))}

			<Button onClick={handlePay} className="mt-4" disabled={!selectedItems.length || loading}>
				{loading ? "Processing..." : "Pay Selected Items"}
			</Button>
		</div>
	);
}
