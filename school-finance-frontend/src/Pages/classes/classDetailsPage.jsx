import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { apiFetch } from "../../utils/apiFetch";
import FullScreenLoader from "../../components/loader";

const options = [
  {
    key: "students",
    title: "Students",
    description: "View all students registered in this class.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-100 dark:border-blue-900/40",
    hoverBorder: "hover:border-blue-400",
  },
  {
    key: "sessions",
    title: "Sessions",
    description: "Begin a new session and take student activity or financial records.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-100 dark:border-violet-900/40",
    hoverBorder: "hover:border-violet-400",
  },
  {
    key: "add",
    title: "Add Student",
    description: "Register a new student into this class.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-100 dark:border-emerald-900/40",
    hoverBorder: "hover:border-emerald-400",
  },
  {
    key: "scores",
    title: "Record Scores",
    description: "Enter and save class test, mid-semester, and exam scores.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-100 dark:border-amber-900/40",
    hoverBorder: "hover:border-amber-400",
  },
];

export default function ClassDetails() {
  const [message, setMessage] = useState("");
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const { id, class_name } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getClassStudents = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/student/get_class_students/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (!res.ok) setMessage(data.message);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    getClassStudents();
  }, [id]);

  const handleNav = (key) => {
    const routes = {
      students: `/classes/students/${id}`,
      sessions: `/classes/sessions/${id}/${userId}`,
      add:      `/classes/add_student/${id}/${class_name}`,
      scores:   `/classes/scores/${id}`,
    };
    navigate(routes[key]);
  };

  if (loading) return <FullScreenLoader />;

  if (message) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-text">{message}</h2>
          <button onClick={() => navigate(-1)} className="text-primary font-semibold hover:underline text-sm">
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8 animate-fadeUp">

        {/* Header */}
        <div className="space-y-1">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors font-medium mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All Classes
          </button>
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">Class Options</p>
          <h1 className="font-display text-4xl font-bold text-text">{class_name}</h1>
          <p className="text-text-muted text-sm">Choose an action to manage this class</p>
        </div>

        {/* Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleNav(opt.key)}
              className={`
                group text-left p-6 rounded-2xl border ${opt.border} ${opt.bg} ${opt.hoverBorder}
                hover:shadow-card-hover hover:-translate-y-0.5
                transition-all duration-200 active:scale-[0.98]
              `}
            >
              <div className={`inline-flex p-3 rounded-xl bg-card shadow-card mb-4 ${opt.color}`}>
                {opt.icon}
              </div>
              <h2 className={`font-display text-xl font-bold mb-1.5 ${opt.color}`}>{opt.title}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{opt.description}</p>
              <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${opt.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                Open
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
