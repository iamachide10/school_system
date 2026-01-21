export function Summary({ student, payments }) {
  console.log(student);
  
  const totalPaid = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  const balance = Number(student.result.required_fees) - totalPaid;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard label="Required Fees" value={student.result.required_fees} />
      <SummaryCard label="Total Paid" value={totalPaid} />
      <SummaryCard label="Balance" value={balance} />
    </div>
  );
}

export function SummaryCard({ label, value }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold">GHS {Number(value).toFixed(2)}</p>
    </div>
  );
}


export function TransactionsTable({ payments }) {
  console.log(payments);
  
  if (payments.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center text-gray-500">
        No transactions found
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Method</th> 
            {/* <th className="px-4 py-3 text-left">Notes</th> */}
          </tr>
        </thead>

        <tbody className="divide-y">
          {payments.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                {new Date(p.payment_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-medium">
                GHS {Number(p.amount).toFixed(2)}
              </td>
              <td className="px-4 py-3 capitalize">
                {p.payment_method || "-"}
              </td>

              {/* <td className="px-4 py-3 text-gray-500">
                {p.notes || "-"}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
