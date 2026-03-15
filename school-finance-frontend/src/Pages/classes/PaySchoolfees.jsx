import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adaptStudentFromApi } from "../../components/Student Profile/studentAdapter";
import BACKEND_URL from "../../utils/backend";
import FullScreenLoader from "../../components/loader";
import { InputField, StatusMessage, PrimaryButton } from "../../components/ui";

/* ── Stat card ──────────────────────────────────────── */
function FeeStat({ label, value, highlight = false }) {
  return (
    <div className={`
      flex flex-col gap-1 p-4 rounded-xl border
      ${highlight
        ? "bg-primary/5 border-primary/20"
        : "bg-card border-border"}
    `}>
      <span className="text-xs font-medium text-text-muted uppercase tracking-wide">{label}</span>
      <span className={`font-display text-2xl font-bold ${highlight ? "text-primary" : "text-text"}`}>
        GHS {Number(value || 0).toFixed(2)}
      </span>
    </div>
  );
}

export default function PaySchoolFees() {
  const { student_id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [feesSummary, setFeesSummary] = useState(null);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/student/get_student_with_fees/${student_id}`);
        if (!res.ok) throw new Error("Failed to load student");
        const data = await res.json();
        setStudent(adaptStudentFromApi({ result: data.student }));
        setFeesSummary(data.fees);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [student_id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || Number(amount) <= 0) {
      return setError("Please enter a valid amount.");
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/payment/pay_fees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id,
          amount: Number(amount),
          notes,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "Payment failed.");
      }

      const { receipt } = data;
      setSuccess(
        `Payment of GHS ${receipt.amount_paid.toFixed(2)} recorded. Remaining balance: GHS ${receipt.remaining_balance.toFixed(2)}.`
      );
      setAmount("");
      setNotes("");

      // Refresh fees summary
      const updated = await fetch(`${BACKEND_URL}/api/student/get_student_with_fees/${student_id}`);
      if (updated.ok) {
        const updatedData = await updated.json();
        setFeesSummary(updatedData.fees);
      }
    } catch (err) {
      setError("Server error. Payment failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <FullScreenLoader />;

  if (error && !student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-text">{error}</h2>
          <button onClick={() => navigate(-1)} className="text-primary font-semibold hover:underline text-sm">
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const balance = feesSummary?.balance ?? 0;
  const isPaid = balance <= 0;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6 animate-fadeUp">

        {/* Back + Title */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors font-medium mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="font-display text-3xl font-bold text-text">Pay School Fees</h1>
          <p className="text-text-muted text-sm mt-1">Record a fee payment for this student</p>
        </div>

        {/* Student info card */}
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-text">{student?.personal?.full_name}</p>
            <p className="text-sm text-text-muted">Index: {student?.personal?.index_number}</p>
          </div>
          {isPaid && (
            <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Fully Paid
            </span>
          )}
        </div>

        {/* Fees summary */}
        <div className="grid grid-cols-3 gap-3">
          <FeeStat label="Required" value={feesSummary?.required} />
          <FeeStat label="Total Paid" value={feesSummary?.paid} />
          <FeeStat label="Balance" value={feesSummary?.balance} highlight={!isPaid} />
        </div>

        {/* Payment form */}
        {!isPaid ? (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-display text-lg font-bold text-text">Record Payment</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Amount (GHS)"
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="space-y-1.5">
                <label htmlFor="notes" className="block text-sm font-semibold text-text-secondary">
                  Notes <span className="font-normal text-text-muted">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  placeholder="e.g. Term 1 fees…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="
                    w-full px-4 py-2.5 resize-none
                    bg-input border border-border rounded-xl
                    text-text placeholder:text-text-muted text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                    transition-all duration-150
                  "
                />
              </div>

              <StatusMessage type="error" message={error} />
              <StatusMessage type="success" message={success} />

              <PrimaryButton loading={submitting} type="submit">
                {submitting ? "Recording…" : "Record Payment"}
              </PrimaryButton>
            </form>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-3 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-display text-lg font-bold text-text">All fees are settled</p>
            <p className="text-text-muted text-sm">This student has no outstanding balance.</p>
            <StatusMessage type="success" message={success} />
          </div>
        )}

        {/* View transactions link */}
        <div className="text-center">
          <a
            href={`/students/${student?.personal?.student_code}/transactions`}
            className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline"
          >
            View full transaction history
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
