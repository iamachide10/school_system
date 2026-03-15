import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import FullScreenLoader from "../../components/loader";
import BACKEND_URL from "../../utils/backend";
import { apiFetch } from "../../utils/apiFetch";
import { StatusMessage } from "../../components/ui";

/* ── Stat Card ──────────────────────────────────────── */
function StatCard({ label, value, color }) {
  const themes = {
    default: "bg-card border-border text-text",
    green:   "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
    red:     "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
    amber:   "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400",
  };
  const labelThemes = {
    default: "text-text-muted",
    green:   "text-emerald-600 dark:text-emerald-500",
    red:     "text-red-500 dark:text-red-400",
    amber:   "text-amber-600 dark:text-amber-500",
  };
  return (
    <div className={`flex-1 min-w-[140px] border rounded-xl p-4 ${themes[color]}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${labelThemes[color]}`}>
        {label}
      </p>
      <p className="font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

/* ── Finish Session Modal ───────────────────────────── */
function FinishModal({ closingCode, onConfirm, onCancel, loading }) {
  const [input, setInput] = useState("");
  const wrong = input.length > 0 && input !== closingCode;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 space-y-5 shadow-2xl animate-fadeUp">
        <div className="space-y-1">
          <h3 className="font-display text-xl font-bold text-text">Finish Session</h3>
          <p className="text-text-muted text-sm">
            Enter the session closing code to finish and lock this session.
          </p>
        </div>

        {/* Code hint */}
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15">
          <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-xs text-text-muted font-medium">Session Code</p>
            <p className="font-display text-lg font-bold text-primary tracking-widest">{closingCode}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-text-secondary">
            Confirm Code
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter code to confirm"
            autoFocus
            className={`
              w-full px-4 py-2.5 text-center font-display font-bold text-lg tracking-widest
              bg-input border rounded-xl text-text placeholder:text-text-muted placeholder:font-normal placeholder:text-base placeholder:tracking-normal
              focus:outline-none focus:ring-2 transition-all duration-150
              ${wrong
                ? "border-red-400 focus:ring-red-400/40"
                : "border-border focus:ring-primary/50 focus:border-primary"}
            `}
          />
          {wrong && (
            <p className="text-xs text-red-500 font-medium">Incorrect code</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border-2 border-border text-text font-semibold text-sm hover:bg-surface transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(input)}
            disabled={input !== closingCode || loading}
            className="
              flex-1 py-2.5 rounded-xl
              bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed
              text-white font-semibold text-sm
              transition-all duration-150 active:scale-[0.98]
              flex items-center justify-center gap-2
            "
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            Finish Session
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main SessionPage ───────────────────────────────── */
export const SessionPage = () => {
  const { class_id, teacher_id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [search, setSearch]               = useState("");
  const [sessionId, setSessionId]         = useState(null);
  const [closingCode, setClosingCode]     = useState("");
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [students, setStudents]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [finishing, setFinishing]         = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [submitMsg, setSubmitMsg]         = useState({ type: "", text: "" });

  const filteredStudents = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.student_code.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Start / resume session ──────────────────────── */
  useEffect(() => {
    if (!token) return;
    const createSession = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/session/start_session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ class_id, teacher_id }),
        });
        const data = await res.json();
        if (res.ok) {
          setSessionId(data.session.id);
          setClosingCode(data.session.session_code);
          if (data.status === "existing") {
            setShouldRefresh(true);
          } else {
            await loadStudents();
            handleSubmit();
          }
        }
      } catch (e) {
        console.log("createSession error:", e);
      }
    };
    createSession();
  }, [class_id, teacher_id, token]);

  /* ── Load class students ─────────────────────────── */
  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/student/get_class_students/${class_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) setStudents(data.result);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  /* ── Fetch session records ───────────────────────── */
  useEffect(() => {
    if (!sessionId) return;
    const fetchSessionRecords = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/session/${sessionId}/records`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStudents(
            data.map((r) => ({
              id:           Number(r.student_id),
              full_name:    r.full_name,
              student_code: r.student_code,
              default_fees: Number(r.default_fees ?? r.fee_amount),
              has_paid:     Boolean(r.has_paid),
            }))
          );
        } else {
          await loadStudents();
        }
      } catch (err) {
        console.error("fetchSessionRecords error:", err);
      }
      setLoading(false);
      setShouldRefresh(false);
    };
    fetchSessionRecords();
  }, [shouldRefresh]);

  /* ── Toggle paid ─────────────────────────────────── */
  const togglePaid = (id) => {
    setStudents((prev) =>
      prev.map((s) => s.id === id ? { ...s, has_paid: !Boolean(s.has_paid) } : s)
    );
  };

  /* ── Submit / save session records ──────────────── */
  const handleSubmit = async () => {
    if (!sessionId || loading) return;
    setSubmitting(true);
    setSubmitMsg({ type: "", text: "" });
    const cleanedStudents = students.map((s) => ({
      student_id:   Number(s.id),
      has_paid:     Boolean(s.has_paid),
      default_fees: Number(s.default_fees),
    }));
    try {
      const result = await fetch(`${BACKEND_URL}/api/session/submit_session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, students: cleanedStudents }),
      });
      const data = await result.json();
      if (result.ok) {
        setShouldRefresh(true);
        setSubmitMsg({ type: "success", text: "Session records saved successfully." });
      } else {
        setSubmitMsg({ type: "error", text: data.message || "Failed to save records." });
      }
    } catch (e) {
      setSubmitMsg({ type: "error", text: "Network error. Could not save." });
    }
    setSubmitting(false);
    setTimeout(() => setSubmitMsg({ type: "", text: "" }), 3500);
  };

  /* ── Finish session ──────────────────────────────── */
  const handleFinishSession = async (enteredCode) => {
    setFinishing(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/session/finish_session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, sessionCode: enteredCode }),
      });
      if (res.ok) {
        setShowFinishModal(false);
        navigate("/classes");
      }
    } catch (e) {
      console.log(e);
    }
    setFinishing(false);
  };

  /* ── Derived stats ───────────────────────────────── */
  const totalStudents    = students.length;
  const studentsPaid     = students.filter((s) => s.has_paid).length;
  const studentsUnpaid   = students.filter((s) => !s.has_paid).length;
  const amountReceived   = students
    .filter((s) => s.has_paid)
    .reduce((sum, s) => sum + Number(s.default_fees), 0);
  const progressPct      = totalStudents > 0
    ? Math.round((studentsPaid / totalStudents) * 100)
    : 0;

  if (loading) return <FullScreenLoader />;

  return (
    <>
      {/* Finish modal */}
      {showFinishModal && (
        <FinishModal
          closingCode={closingCode}
          onConfirm={handleFinishSession}
          onCancel={() => setShowFinishModal(false)}
          loading={finishing}
        />
      )}

      <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeUp">

          {/* ── Header ──────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors font-medium mb-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to class
              </button>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-1">
                Active Session
              </p>
              <h1 className="font-display text-4xl font-bold text-text">Fee Collection</h1>
            </div>

            {/* Session code badge */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/20 self-start">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <div>
                <p className="text-xs text-text-muted font-medium leading-none">Session Code</p>
                <p className="font-display text-base font-bold text-primary tracking-widest leading-tight mt-0.5">
                  {closingCode}
                </p>
              </div>
            </div>
          </div>

          {/* ── Stats ───────────────────────────────── */}
          <div className="flex flex-wrap gap-3">
            <StatCard label="Total Students"  value={totalStudents}  color="default" />
            <StatCard label="Paid"            value={studentsPaid}   color="green"   />
            <StatCard label="Unpaid"          value={studentsUnpaid} color="red"     />
            <StatCard label={`GH₵ Received`} value={`${amountReceived.toFixed(2)}`} color="amber" />
          </div>

          {/* ── Progress bar ────────────────────────── */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-text-muted">
              <span>Payment progress</span>
              <span className="text-primary">{progressPct}%</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* ── Search ──────────────────────────────── */}
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or index…"
              className="
                w-full pl-10 pr-4 py-2.5
                bg-card border border-border rounded-xl
                text-text text-sm placeholder:text-text-muted
                focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                transition-all duration-150
              "
            />
          </div>

          {/* ── Student list ────────────────────────── */}
          <div className="space-y-2">
            {filteredStudents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="font-display text-lg font-bold text-text">No students found</p>
                <p className="text-text-muted text-sm">
                  {search ? "Try a different search term." : "No students in this session yet."}
                </p>
              </div>
            )}

            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => togglePaid(student.id)}
                className={`
                  group flex items-center justify-between
                  p-4 rounded-xl border cursor-pointer
                  transition-all duration-150 active:scale-[0.99]
                  ${student.has_paid
                    ? "bg-emerald-50 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-800"
                    : "bg-card border-border hover:border-primary/30 hover:bg-surface"}
                `}
              >
                {/* Student info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                    ${student.has_paid
                      ? "bg-primary text-white"
                      : "bg-border text-text-muted"}
                  `}>
                    {student.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-text text-sm truncate">{student.full_name}</p>
                    <p className="text-xs text-text-muted">{student.student_code}</p>
                  </div>
                </div>

                {/* Right side: fee + checkbox */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-text-muted font-medium">Fee</p>
                    <p className={`font-display font-bold text-sm ${
                      student.has_paid ? "text-primary" : "text-text"
                    }`}>
                      GH₵ {Number(student.default_fees).toFixed(2)}
                    </p>
                  </div>

                  {/* Custom checkbox */}
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150
                    ${student.has_paid
                      ? "bg-primary border-primary"
                      : "border-border group-hover:border-primary/50"}
                  `}>
                    {student.has_paid && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Feedback message ────────────────────── */}
          {submitMsg.text && (
            <StatusMessage type={submitMsg.type} message={submitMsg.text} />
          )}

          {/* ── Action buttons ──────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="
                flex-1 py-3 px-6 rounded-xl
                bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed
                text-white font-semibold text-sm
                shadow-lg shadow-primary/25
                transition-all duration-200 active:scale-[0.98]
                flex items-center justify-center gap-2
              "
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Progress
                </>
              )}
            </button>

            <button
              onClick={() => setShowFinishModal(true)}
              className="
                flex-1 py-3 px-6 rounded-xl
                bg-red-600 hover:bg-red-700
                text-white font-semibold text-sm
                transition-all duration-200 active:scale-[0.98]
                flex items-center justify-center gap-2
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Finish Session
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
