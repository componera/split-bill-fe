"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import io from "socket.io-client";

let socket;

export default function BillDetail() {
  const params = useParams();
  const { restaurantId, billId } = params;
  const [bill, setBill] = useState(null);

  useEffect(() => {
    fetchBill();

    // Socket.IO realtime updates
    socket = io(process.env.NEXT_PUBLIC_API_URL);
    socket.emit("join", `restaurant-${restaurantId}`);
    socket.on("bill.updated", (updatedBill) => {
      if (updatedBill.id === billId) setBill(updatedBill);
    });

    return () => socket.disconnect();
  }, []);

  const fetchBill = async () => {
    const res = await axios.get(
      `/api/restaurants/${restaurantId}/bills/${billId}`,
    );
    setBill(res.data);
  };

  if (!bill) return <div>Loading bill...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bill Detail</h1>
      <table className="min-w-full bg-white shadow rounded-xl">
        <thead>
          <tr>
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-left">Price</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item) => (
            <tr key={item.id}>
              <td className="p-2">{item.name}</td>
              <td className="p-2">R {item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 font-bold">
        Total: R {bill.items.reduce((sum, i) => sum + i.price, 0).toFixed(2)}
      </p>
    </div>
  );
}
