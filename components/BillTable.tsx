import React from "react";
import Link from "next/link";
import BillItemRow from "./BillItemRow";

export default function BillTable({ bills, restaurantId }) {
  return (
    <table className="min-w-full bg-white shadow rounded-xl">
      <thead>
        <tr>
          <th className="p-2 text-left">Bill ID</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Total</th>
          <th className="p-2 text-left">View</th>
        </tr>
      </thead>
      <tbody>
        {bills.map((bill) => (
          <BillItemRow key={bill.id} bill={bill} restaurantId={restaurantId} />
        ))}
      </tbody>
    </table>
  );
}
