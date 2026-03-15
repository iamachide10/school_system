import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FullScreenLoader from "../../components/loader";
import BACKEND_URL from "../../utils/backend";
import { StatusMessage } from "../../components/ui";

/* ── Student row ────────────────────────────────────── */
function StudentRow({ student, paid }) {
  return (
    <div className={`
      flex items-center justify-between p-4 rounded-xl border
      ${paid
        ? "bg-emerald-50 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-800"
        : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"}
    `}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`
          w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0
          ${paid
            ? "bg-primary text-white"
            : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"}
        `}>
          {student.full_name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-text text-sm truncate">{student.full_name}</p>
          <p className="text-xs text-text-muted">{student.student_code}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className={`
          font-display font-bold text-sm
          ${paid ? "text-primary" : "text-red-600 dark:text-red-400"}
        `}>
          GH₵ {Number(student.fee_amount).toFixed(2)}
        </span>
        <span className={`
          inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full
          ${paid
            ? "bg-primary/10 text-primary"
            : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}
        `}>
          {paid ? (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Paid
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Unpaid
            </>
          )}
        </span>
      </div>
    </div>
  );
}

/* ── Summary stat ───────────────────────────────────── */
function SummaryCard({ label, value, sub, color }) {
  const themes = {
    green: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    red:   "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
  };
  const textThemes = {
    green: "text-primary",
    red:   "text-red-600 dark:text-red-400",
  };
  return (
    <div className={`flex-1 border rounded-xl p-4 ${themes[color]}`}>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">{label}</p>
      <p className={`font-display text-2xl font-bold ${textThemes[color]}`}>{value}</p>
      {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
    </div>
  );
}

/* ── Main SessionDetails ────────────────────────────── */
export default function SessionDetails() {
  const { session_id } = useParams();
  const navigate = useNavigate();

  const [students, setStudents]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [activeTab, setActiveTab]   = useState("all"); // all | paid | unpaid

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/session/${session_id}/records`);
        const data = await res.json();
        if (res.ok) setStudents(data.result || data);
      } catch (err) {
        setError("Failed to load session details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessionDetails();
  }, [session_id]);

  const handleConfirm = async () => {
    setConfirming(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/session/${session_id}/confirm`);
      if (res.ok) {
        setSuccess("Session confirmed successfully! Redirecting…");
        setTimeout(() => navigate("/accountant-dashboard"), 2000);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to confirm session.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setConfirming(false);
    }
  };

  const paidStudents   = students.filter((s) => s.has_paid);
  const unpaidStudents = students.filter((s) => !s.has_paid);
  const totalPaid      = paidStudents.reduce((acc, s) => acc + Number(s.fee_amount), 0);
  const totalUnpaid    = unpaidStudents.reduce((acc, s) => acc + Number(s.fee_amount), 0);
  const totalAmount    = totalPaid + totalUnpaid;
  const progressPct    = students.length > 0
    ? Math.round((paidStudents.length / students.length) * 100)
    : 0;

  const tabs = [
    { key: "all",    label: "All",    count: students.length },
    { key: "paid",   label: "Paid",   count: paidStudents.length },
    { key: "unpaid", label: "Unpaid", count: unpaidStudents.length },
  ];

  const visibleStudents =
    activeTab === "paid"   ? paidStudents   :
    activeTab === "unpaid" ? unpaidStudents :
    students;

  if (loading) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeUp">

        {/* ── Header ──────────────────────────────── */}
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
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-1">Review</p>
          <h1 className="font-display text-4xl font-bold text-text">Session Details</h1>
          <p className="text-text-muted text-sm mt-1">
            {students.length} student{students.length !== 1 ? "s" : ""} · GH₵ {totalAmount.toFixed(2)} total
          </p>
        </div>

        {/* ── Summary cards ───────────────────────── */}
        <div className="flex flex-wrap gap-3">
          <SummaryCard
            label="Total Collected"
            value={`GH₵ ${totalPaid.toFixed(2)}`}
            sub={`${paidStudents.length} students`}
            color="green"
          />
          <SummaryCard
            label="Outstanding"
            value={`GH₵ ${totalUnpaid.toFixed(2)}`}
            sub={`${unpaidStudents.length} students`}
            color="red"
          />
        </div>

        {/* ── Progress bar ────────────────────────── */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-text-muted">
            <span>Collection progress</span>
            <span className="text-primary">{progressPct}%</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* ── Tab filter ──────────────────────────── */}
        <div className="flex gap-1 p-1 bg-surface border border-border rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-150
                flex items-center justify-center gap-1.5
                ${activeTab === tab.key
                  ? "bg-card shadow-sm text-text border border-border"
                  : "text-text-muted hover:text-text"}
              `}
            >
              {tab.label}
              <span className={`
                inline-flex items-center justify-center text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[20px]
                ${activeTab === tab.key
                  ? tab.key === "paid"   ? "bg-primary/10 text-primary"
                    : tab.key === "unpaid" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    : "bg-primary/10 text-primary"
                  : "bg-border text-text-muted"}
              `}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Student list ────────────────────────── */}
        <div className="space-y-2">
          {visibleStudents.length > 0 ? (
            visibleStudents.map((s) => (
              <StudentRow key={s.student_id} student={s} paid={s.has_paid} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-display text-lg font-bold text-text">
                No {activeTab !== "all" ? activeTab : ""} students
              </p>
              <p className="text-text-muted text-sm">
                {activeTab === "unpaid"
                  ? "All students have paid — great!"
                  : activeTab === "paid"
                  ? "No payments recorded yet."
                  : "No students in this session."}
              </p>
            </div>
          )}
        </div>

        {/* ── Feedback messages ───────────────────── */}
        {error   && <StatusMessage type="error"   message={error}   />}
        {success && <StatusMessage type="success" message={success} />}

        {/* ── Confirm button ──────────────────────── */}
        <button
          onClick={handleConfirm}
          disabled={confirming || !!success}
          className="
            w-full py-3.5 rounded-xl
            bg-primary hover:bg-primary-dark
            disabled:opacity-60 disabled:cursor-not-allowed
            text-white font-semibold
            shadow-lg shadow-primary/25
            transition-all duration-200 active:scale-[0.98]
            flex items-center justify-center gap-2
          "
        >
          {confirming ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Confirming…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Confirm Session
            </>
          )}
        </button>

      </div>
    </div>
  );
}
