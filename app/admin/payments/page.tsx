"use client";

import { useParams } from "next/navigation";
import { usePayments } from "../../../../lib/api/hooks/usePayments";

export default function PaymentsPage() {
	const params = useParams();
	const restaurantId = params.restaurantId as string;

	const { payments } = usePayments(restaurantId);

	return (
		<div className="p-6">
			<h1 className="text-xl font-bold">Payments (Realtime)</h1>

			<table className="w-full mt-4">
				<thead>
					<tr>
						<th>ID</th>
						<th>Amount</th>
					</tr>
				</thead>

				<tbody>
					{payments.map(payment => (
						<tr key={payment.id}>
							<td>{payment.id}</td>
							<td>R {payment.amount}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
