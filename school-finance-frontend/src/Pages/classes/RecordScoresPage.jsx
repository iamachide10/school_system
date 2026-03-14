import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef, useCallback } from "react"
import { apiFetch } from "../../utils/apiFetch"
import FullScreenLoader from "../../components/loader"

const LIMITS = { class_test: 20, mid_sem: 20, exam: 60 }

// ── Step 1: Pick semester ────────────────────────────────────
function SemesterSelect({ onSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <h1 className="mt-[5rem] text-4xl font-bold text-green-700 text-center mb-4">
        Record Student Scores
      </h1>
      <p className="text-center text-gray-500 mb-10">Select a semester to continue</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
        {[1, 2].map((sem) => (
          <div
            key={sem}
            onClick={() => onSelect(sem)}
            className="cursor-pointer bg-white p-10 rounded-xl shadow hover:shadow-lg
                       transition border border-green-100 hover:border-green-400 text-center"
          >
            <div className="text-5xl mb-4">{sem === 1 ? "📘" : "📗"}</div>
            <h2 className="text-2xl font-semibold text-green-700">Semester {sem}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step 2: Pick subject ─────────────────────────────────────
function SubjectSelect({ semester, subjects, onSelect, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <button
        onClick={onBack}
        className="mt-[5rem] flex items-center gap-2 text-green-700 font-semibold mb-6 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-green-700 text-center mb-2">
        Semester {semester} — Select Subject
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Choose a subject to enter scores
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl mx-auto">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            onClick={() => onSelect(sub)}
            className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-lg
                       transition border border-green-100 hover:border-green-400 text-center"
          >
            <div className="text-3xl mb-3">📚</div>
            <h2 className="text-lg font-semibold text-green-700">{sub.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step 3: Score entry table ────────────────────────────────
function ScoreTable({ classId, semester, subject, onBack }) {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [toast, setToast]     = useState(null)   // { text, ok }
  const inputRefs             = useRef({})

  // Fetch students + existing scores, merge them
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const load = async () => {
      try {
        const res = await apiFetch(
          `/scores/${classId}?subject_id=${subject.id}&semester=${semester}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        )
        const data = await res.json()

        if (!cancelled && res.ok) {
          // API returns students LEFT JOIN scores — every student is present
          setRows(
            data.result.map((r) => ({
              student_code: r.student_code,
              full_name:    r.full_name,
              class_test:   r.class_test  != null ? String(r.class_test)  : "",
              mid_sem:      r.mid_sem     != null ? String(r.mid_sem)     : "",
              exam:         r.exam        != null ? String(r.exam)        : "",
            }))
          )
        }
      } catch (e) {
        console.log(e)
      }
      if (!cancelled) setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [classId, subject.id, semester])

  const getTotal = (row) =>
    (parseFloat(row.class_test) || 0) +
    (parseFloat(row.mid_sem)    || 0) +
    (parseFloat(row.exam)       || 0)

  const handleChange = useCallback((student_code, field, raw) => {
    const max = LIMITS[field]
    let val = raw.replace(/[^0-9.]/g, "")
    if (val !== "" && parseFloat(val) > max) val = String(max)
    setRows((prev) =>
      prev.map((r) => r.student_code === student_code ? { ...r, [field]: val } : r)
    )
  }, [])

  // Tab → right, Enter → down  (matches spec)
  const handleKeyDown = useCallback((e, rowIdx, colIdx) => {
    const colCount = 3
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault()
      const next = colIdx + 1 < colCount
        ? [rowIdx, colIdx + 1]
        : [rowIdx + 1, 0]
      inputRefs.current[`${next[0]}-${next[1]}`]?.focus()
    } else if (e.key === "Enter") {
      e.preventDefault()
      inputRefs.current[`${rowIdx + 1}-${colIdx}`]?.focus()
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
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
      })
      const data = await res.json()
      setToast({ text: data.message, ok: res.ok })
    } catch (e) {
      setToast({ text: "Network error — could not save.", ok: false })
    }
    setSaving(false)
    setTimeout(() => setToast(null), 3500)
  }

  const cols = [
    { key: "class_test", label: "Class Test", max: 20 },
    { key: "mid_sem",    label: "Mid Sem",    max: 20 },
    { key: "exam",       label: "Exam",       max: 60 },
  ]

  if (loading) return <FullScreenLoader />

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-semibold
                         transition-all ${toast.ok ? "bg-green-600" : "bg-red-500"}`}>
          {toast.ok ? "✓ " : "✕ "}{toast.text}
        </div>
      )}

      {/* Header */}
      <div className="mt-[5rem] flex items-center justify-between max-w-5xl mx-auto mb-6 flex-wrap gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-green-700 font-semibold mb-2 hover:underline"
          >
            ← Back to subjects
          </button>
          <h1 className="text-3xl font-bold text-green-700">{subject.name}</h1>
          <p className="text-gray-500">Semester {semester} · {rows.length} students</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300
                     text-white font-semibold rounded-xl shadow transition flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving…
            </>
          ) : "💾 Save Scores"}
        </button>
      </div>

      {/* Score limits reminder */}
      <div className="max-w-5xl mx-auto mb-4 flex gap-6 text-sm text-gray-500">
        <span>Class Test <strong className="text-green-700">/20</strong></span>
        <span>Mid Sem <strong className="text-green-700">/20</strong></span>
        <span>Exam <strong className="text-green-700">/60</strong></span>
        <span>Total <strong className="text-green-700">/100</strong></span>
      </div>

      {/* Table */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow overflow-hidden border border-green-100">
        <table className="w-full border-collapse">
          <thead className="bg-green-50 border-b border-green-200">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-bold text-green-800 w-2/5">Student</th>
              {cols.map((c) => (
                <th key={c.key} className="text-center px-4 py-3 text-sm font-bold text-green-800">
                  {c.label} <span className="font-normal text-gray-400">/{c.max}</span>
                </th>
              ))}
              <th className="text-center px-4 py-3 text-sm font-bold text-green-800">
                Total <span className="font-normal text-gray-400">/100</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIdx) => {
              const total = getTotal(row)
              return (
                <tr
                  key={row.student_code}
                  className="border-b border-gray-100 hover:bg-green-50 transition"
                >
                  {/* Student name + code */}
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-800">{row.full_name}</p>
                    <p className="text-xs text-gray-400">{row.student_code}</p>
                  </td>

                  {/* Score inputs */}
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
                        className="w-16 text-center border border-green-300 rounded-lg py-1.5 text-sm
                                   font-semibold focus:outline-none focus:ring-2 focus:ring-green-400
                                   [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </td>
                  ))}

                  {/* Auto total */}
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold
                      ${total >= 75 ? "bg-green-100 text-green-700"
                        : total >= 50 ? "bg-yellow-100 text-yellow-700"
                        : total > 0  ? "bg-red-100 text-red-600"
                                      : "bg-gray-100 text-gray-400"}`}>
                      {total > 0 ? total.toFixed(1) : "—"}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {rows.length === 0 && (
          <p className="text-center text-gray-400 py-12">No students found in this class.</p>
        )}
      </div>
    </div>
  )
}

// ── Root page — controls the 3-step flow ────────────────────
export default function RecordScoresPage() {
  const { id: classId } = useParams()
  const navigate = useNavigate()

  const [step, setStep]           = useState("semester")   // semester | subject | table
  const [semester, setSemester]   = useState(null)
  const [subjects, setSubjects]   = useState([])
  const [subject, setSubject]     = useState(null)
  const [loadingSubs, setLoadingSubs] = useState(false)

  const handleSemesterSelect = async (sem) => {
    setSemester(sem)
    setLoadingSubs(true)
    try {
      const res = await apiFetch("/scores/subjects", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      const data = await res.json()
      if (res.ok) setSubjects(data.result)
    } catch (e) {
      console.log(e)
    }
    setLoadingSubs(false)
    setStep("subject")
  }

  const handleSubjectSelect = (sub) => {
    setSubject(sub)
    setStep("table")
  }

  if (step === "semester") {
    return <SemesterSelect onSelect={handleSemesterSelect} />
  }

  if (step === "subject") {
    if (loadingSubs) return <FullScreenLoader />
    return (
      <SubjectSelect
        semester={semester}
        subjects={subjects}
        onSelect={handleSubjectSelect}
        onBack={() => setStep("semester")}
      />
    )
  }

  if (step === "table") {
    return (
      <ScoreTable
        classId={classId}
        semester={semester}
        subject={subject}
        onBack={() => setStep("subject")}
      />
    )
  }
}
