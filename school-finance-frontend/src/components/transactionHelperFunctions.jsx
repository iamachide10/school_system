export function Summary({ student, payments }) {
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const required  = Number(student.result.required_fees);
  const balance   = required - totalPaid;
  const pct       = required > 0 ? Math.min(100, Math.round((totalPaid / required) * 100)) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Required Fees" value={required}  color="default" />
        <SummaryCard label="Total Paid"    value={totalPaid} color="green"   />
        <SummaryCard label="Balance"       value={balance}   color={balance <= 0 ? "green" : "red"} />
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-text-muted">
          <span>Payment progress</span>
          <span className="text-primary">{pct}%</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function SummaryCard({ label, value, color = "default" }) {
  const themes = {
    default: "bg-card border-border text-text",
    green:   "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
    red:     "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400",
  };
  return (
    <div className={`border rounded-xl p-4 ${themes[color]}`}>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">{label}</p>
      <p className="font-display text-2xl font-bold">GHS {Number(value).toFixed(2)}</p>
    </div>
  );
}

export function TransactionsTable({ payments }) {
  if (!payments || payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-card border border-border rounded-2xl animate-fadeIn">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <p className="font-display text-lg font-bold text-text">No transactions yet</p>
        <p className="text-text-muted text-sm">Payment records will appear here once fees are processed.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-5 py-3.5 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Date</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-surface transition-colors">
                <td className="px-5 py-3.5 text-text-secondary">
                  {new Date(p.payment_date).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-display font-bold text-primary">
                    GHS {Number(p.amount).toFixed(2)}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">
                    {p.payment_method || "Cash"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
