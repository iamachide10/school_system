import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { StudentCard } from "../../components/studentCard";
import { apiFetch } from "../../utils/apiFetch";
import FullScreenLoader from "../../components/loader";

export default function StudentsList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.student_code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const getClassStudents = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/student/get_class_students/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok) setStudents(data.result);
        else setMessage(data.message);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    getClassStudents();
  }, [id]);

  if (loading) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8 animate-fadeUp">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-1">Class Roster</p>
            <h1 className="font-display text-4xl font-bold text-text">Students</h1>
            <p className="text-text-muted text-sm mt-1">
              {students.length} student{students.length !== 1 ? "s" : ""} enrolled
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
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
        </div>

        {/* Error message */}
        {message && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium animate-fadeIn">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {message}
          </div>
        )}

        {/* Student grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((student) => (
              <StudentCard key={student.student_code} student={student} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-text">
              {search ? "No students match your search" : "No students yet"}
            </h3>
            <p className="text-text-muted text-sm max-w-xs">
              {search
                ? "Try a different name or index number."
                : "Add students to this class to see them here."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm text-primary font-semibold hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
