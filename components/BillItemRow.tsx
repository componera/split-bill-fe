import Link from "next/link";

export default function BillItemRow({ bill, restaurantId }) {
  const total = bill.items.reduce((sum, i) => sum + i.price, 0);
  return (
    <tr>
      <td className="p-2">{bill.id}</td>
      <td className="p-2">{bill.status}</td>
      <td className="p-2">R {total.toFixed(2)}</td>
      <td className="p-2">
        <Link
          href={`/admin/${restaurantId}/bills/${bill.id}`}
          className="text-blue-600"
        >
          View
        </Link>
      </td>
    </tr>
  );
}
