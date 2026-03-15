import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { apiFetch } from "../../utils/apiFetch";
import FullScreenLoader from "../../components/loader";

const LIMITS = { class_test: 20, mid_sem: 20, exam: 60 };

/* ── Step indicator ─────────────────────────────────── */
function StepBadge({ current, total, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">
        {current}
      </span>
      <span className="text-xs text-text-muted font-medium">of {total}</span>
      <span className="text-xs text-text-secondary font-semibold">— {label}</span>
    </div>
  );
}

/* ── Back button ────────────────────────────────────── */
function BackBtn({ onClick, label = "Back" }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors font-medium"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {label}
    </button>
  );
}

/* ── Step 1: Pick semester ──────────────────────────── */
function SemesterSelect({ onSelect }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-8 animate-fadeUp">
        <div>
          <BackBtn onClick={() => navigate(-1)} label="Back to class" />
          <div className="mt-4">
            <StepBadge current={1} total={3} label="Choose semester" />
            <h1 className="font-display text-4xl font-bold text-text mt-2">Record Scores</h1>
            <p className="text-text-muted text-sm mt-1">Select a semester to get started</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2].map((sem) => (
            <button
              key={sem}
              onClick={() => onSelect(sem)}
              className="
                group text-left p-8 rounded-2xl border border-border bg-card
                hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5
                hover:shadow-card-hover transition-all duration-200 active:scale-[0.98]
                flex flex-col items-center gap-4
              "
            >
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black
                ${sem === 1
                  ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600"
                  : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600"}
              `}>
                {sem}
              </div>
              <div className="text-center">
                <p className="font-display text-xl font-bold text-text">Semester {sem}</p>
                <p className="text-text-muted text-xs mt-1 group-hover:text-primary transition-colors">
                  Select →
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: Pick subject ───────────────────────────── */
function SubjectSelect({ semester, subjects, onSelect, onBack }) {
  const [search, setSearch] = useState("");
  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8 animate-fadeUp">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <BackBtn onClick={onBack} label="Back to semesters" />
            <div className="mt-4">
              <StepBadge current={2} total={3} label="Choose subject" />
              <h1 className="font-display text-4xl font-bold text-text mt-2">
                Semester {semester}
              </h1>
              <p className="text-text-muted text-sm mt-1">Select a subject to enter scores</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subjects…"
              className="
                w-full pl-10 pr-4 py-2.5
                bg-card border border-border rounded-xl
                text-text text-sm placeholder:text-text-muted
                focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                transition-all duration-150
              "
            />
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onSelect(sub)}
                className="
                  group text-left p-5 rounded-2xl border border-border bg-card
                  hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5
                  hover:shadow-card-hover transition-all duration-200 active:scale-[0.98]
                  flex items-center gap-3
                "
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-text text-sm truncate">{sub.name}</p>
                  <p className="text-xs text-text-muted group-hover:text-primary transition-colors mt-0.5">
                    Enter scores →
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="font-display text-lg font-bold text-text">No subjects found</p>
            <p className="text-text-muted text-sm">
              {search ? "Try a different search." : "No subjects are available yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Step 3: Score entry table ──────────────────────── */
function ScoreTable({ classId, semester, subject, onBack }) {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);
  const inputRefs             = useRef({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const res = await apiFetch(
          `/scores/${classId}?subject_id=${subject.id}&semester=${semester}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const data = await res.json();
        if (!cancelled && res.ok) {
          setRows(
            data.result.map((r) => ({
              student_code: r.student_code,
              full_name:    r.full_name,
              class_test:   r.class_test != null ? String(r.class_test) : "",
              mid_sem:      r.mid_sem    != null ? String(r.mid_sem)    : "",
              exam:         r.exam       != null ? String(r.exam)       : "",
            }))
          );
        }
      } catch (e) {
        console.log(e);
      }
      if (!cancelled) setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [classId, subject.id, semester]);

  const getTotal = (row) =>
    (parseFloat(row.class_test) || 0) +
    (parseFloat(row.mid_sem)    || 0) +
    (parseFloat(row.exam)       || 0);

  const handleChange = useCallback((student_code, field, raw) => {
    const max = LIMITS[field];
    let val = raw.replace(/[^0-9.]/g, "");
    if (val !== "" && parseFloat(val) > max) val = String(max);
    setRows((prev) =>
      prev.map((r) => r.student_code === student_code ? { ...r, [field]: val } : r)
    );
  }, []);

  const handleKeyDown = useCallback((e, rowIdx, colIdx) => {
    const colCount = 3;
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const next = colIdx + 1 < colCount ? [rowIdx, colIdx + 1] : [rowIdx + 1, 0];
      inputRefs.current[`${next[0]}-${next[1]}`]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      inputRefs.current[`${rowIdx + 1}-${colIdx}`]?.focus();
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch(`/scores/${classId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: subject.id,
          semester,
          scores: rows.map((r) => ({
            student_code: r.student_code,
            class_test:   parseFloat(r.class_test) || 0,
            mid_sem:      parseFloat(r.mid_sem)    || 0,
            exam:         parseFloat(r.exam)        || 0,
          })),
        }),
      });
      const data = await res.json();
      setToast({ text: data.message, ok: res.ok });
    } catch {
      setToast({ text: "Network error — could not save.", ok: false });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3500);
  };

  const cols = [
    { key: "class_test", label: "Class Test", max: 20 },
    { key: "mid_sem",    label: "Mid Sem",    max: 20 },
    { key: "exam",       label: "Exam",       max: 60 },
  ];

  const getGrade = (total) => {
    if (total >= 80) return { label: "A", class: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400" };
    if (total >= 70) return { label: "B", class: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400" };
    if (total >= 60) return { label: "C", class: "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400" };
    if (total >= 50) return { label: "D", class: "bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400" };
    if (total > 0)   return { label: "F", class: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400" };
    return { label: "—", class: "bg-surface text-text-muted" };
  };

  if (loading) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      {/* Toast notification */}
      {toast && (
        <div className={`
          fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold
          flex items-center gap-2 animate-slideDown
          ${toast.ok ? "bg-primary" : "bg-red-600"}
        `}>
          {toast.ok ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {toast.text}
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6 animate-fadeUp">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <BackBtn onClick={onBack} label="Back to subjects" />
            <div className="mt-4">
              <StepBadge current={3} total={3} label="Enter scores" />
              <h1 className="font-display text-4xl font-bold text-text mt-2">{subject.name}</h1>
              <p className="text-text-muted text-sm mt-1">
                Semester {semester} · {rows.length} student{rows.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="
              inline-flex items-center gap-2 px-6 py-3
              bg-primary hover:bg-primary-dark disabled:opacity-60
              text-white font-semibold rounded-xl
              shadow-lg shadow-primary/25
              transition-all duration-200 active:scale-[0.98]
              disabled:cursor-not-allowed
            "
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                Save Scores
              </>
            )}
          </button>
        </div>

        {/* Score limits pill row */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Class Test", max: 20, color: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
            { label: "Mid Sem",    max: 20, color: "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800" },
            { label: "Exam",       max: 60, color: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
            { label: "Total",      max: 100, color: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
          ].map((item) => (
            <span key={item.label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${item.color}`}>
              {item.label}
              <span className="font-bold">/{item.max}</span>
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider w-2/5">
                    Student
                  </th>
                  {cols.map((c) => (
                    <th key={c.key} className="text-center px-4 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider">
                      {c.label}
                      <span className="ml-1 font-normal text-text-muted">/{c.max}</span>
                    </th>
                  ))}
                  <th className="text-center px-4 py-3.5 text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Total
                    <span className="ml-1 font-normal text-text-muted">/100</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {rows.map((row, rowIdx) => {
                  const total = getTotal(row);
                  const grade = getGrade(total);
                  return (
                    <tr key={row.student_code} className="hover:bg-surface transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-text text-sm">{row.full_name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{row.student_code}</p>
                      </td>

                      {cols.map((col, colIdx) => (
                        <td key={col.key} className="px-4 py-3 text-center">
                          <input
                            ref={(el) => (inputRefs.current[`${rowIdx}-${colIdx}`] = el)}
                            type="number"
                            min={0}
                            max={col.max}
                            value={row[col.key]}
                            placeholder="—"
                            onChange={(e) => handleChange(row.student_code, col.key, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                            className="
                              w-16 text-center text-sm font-semibold
                              bg-input border border-border rounded-lg py-1.5
                              text-text placeholder:text-text-muted
                              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                              transition-all duration-150
                              [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none
                            "
                          />
                        </td>
                      ))}

                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${grade.class}`}>
                            {grade.label}
                          </span>
                          <span className="text-sm font-bold text-text">
                            {total > 0 ? total.toFixed(1) : ""}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {rows.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="font-display text-lg font-bold text-text">No students in this class</p>
                <p className="text-text-muted text-sm">Add students to begin recording scores.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Root — controls 3-step flow ────────────────────── */
export default function RecordScoresPage() {
  const { id: classId } = useParams();
  const navigate = useNavigate();

  const [step, setStep]               = useState("semester");
  const [semester, setSemester]       = useState(null);
  const [subjects, setSubjects]       = useState([]);
  const [subject, setSubject]         = useState(null);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const handleSemesterSelect = async (sem) => {
    setSemester(sem);
    setLoadingSubs(true);
    try {
      const res = await apiFetch("/scores/subjects", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) setSubjects(data.result);
    } catch (e) {
      console.log(e);
    }
    setLoadingSubs(false);
    setStep("subject");
  };

  if (step === "semester") return <SemesterSelect onSelect={handleSemesterSelect} />;

  if (step === "subject") {
    if (loadingSubs) return <FullScreenLoader />;
    return (
      <SubjectSelect
        semester={semester}
        subjects={subjects}
        onSelect={(sub) => { setSubject(sub); setStep("table"); }}
        onBack={() => setStep("semester")}
      />
    );
  }

  if (step === "table") {
    return (
      <ScoreTable
        classId={classId}
        semester={semester}
        subject={subject}
        onBack={() => setStep("subject")}
      />
    );
  }
}
