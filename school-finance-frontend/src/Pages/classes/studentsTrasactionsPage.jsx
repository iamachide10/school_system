import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BACKEND_URL from "../../utils/backend";
import { Summary, TransactionsTable } from "../../components/transactionHelperFunctions";
import FullScreenLoader from "../../components/loader";
import { StatusMessage } from "../../components/ui";

export default function StudentTransactionsPage() {
  const { student_code } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [student_code]);

  async function fetchData() {
    try {
      const [studentRes, paymentsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/student/get_student/${student_code}`),
        fetch(`${BACKEND_URL}/api/payment/${student_code}/payments`),
      ]);

      const studentData = await studentRes.json();
      const paymentsData = await paymentsRes.json();

      if (!studentRes.ok || !paymentsRes.ok) {
        return setError("Failed to load transaction history.");
      }

      setStudent(studentData);
      setPayments(paymentsData);
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8 animate-fadeUp">

        {/* Header */}
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
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-1">Finances</p>
          <h1 className="font-display text-4xl font-bold text-text">Transaction History</h1>
          {student && (
            <p className="text-text-muted text-sm mt-1">
              {student.result.full_name}{" "}
              <span className="text-text-secondary font-medium">·</span>{" "}
              {student.result.student_code}
            </p>
          )}
        </div>

        {/* Error */}
        {error && <StatusMessage type="error" message={error} />}

        {/* Summary */}
        {student && <Summary student={student} payments={payments} />}

        {/* Transactions table */}
        {payments.length > 0 ? (
          <TransactionsTable payments={payments} />
        ) : (
          !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-text">No transactions yet</h3>
              <p className="text-text-muted text-sm max-w-xs">
                Payment records will appear here once fees have been processed.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
