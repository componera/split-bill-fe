export default function PaymentTable({ payments }) {
  return (
    <table className="min-w-full bg-white shadow rounded-xl">
      <thead>
        <tr>
          <th className="p-2 text-left">Payment ID</th>
          <th className="p-2 text-left">Bill ID</th>
          <th className="p-2 text-left">Amount</th>
          <th className="p-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p.id}>
            <td className="p-2">{p.id}</td>
            <td className="p-2">{p.billId}</td>
            <td className="p-2">R {p.amount.toFixed(2)}</td>
            <td className="p-2">{p.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
