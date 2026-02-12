"use client";

import { useParams } from "next/navigation";
import { useBills } from "../../../../lib/api/hooks/useBills";

export default function BillsPage() {
	const params = useParams();
	const restaurantId = params.restaurantId as string;

	const { bills } = useBills(restaurantId);

	return (
		<div className="p-6">
			<h1 className="text-xl font-bold">Bills (Realtime)</h1>

			<table className="w-full mt-4">
				<thead>
					<tr>
						<th>ID</th>
						<th>Total</th>
						<th>Status</th>
					</tr>
				</thead>

				<tbody>
					{bills.map(bill => (
						<tr key={bill.id}>
							<td>{bill.id}</td>
							<td>R {bill.total}</td>
							<td>{bill.status}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
