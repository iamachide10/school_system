import { useNavigate } from "react-router-dom";

export default function SessionCard({ session }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/session/${session.session_id}`)}
      className="
        group p-5 bg-card border border-border rounded-2xl cursor-pointer
        hover:border-primary/40 hover:shadow-card-hover hover:-translate-y-0.5
        transition-all duration-200
      "
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display text-lg font-bold text-text">{session.name}</h2>
          <p className="text-text-muted text-xs mt-0.5">
            {new Date(session.time).toLocaleString()}
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-3">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500 mb-0.5">Collected</p>
          <p className="font-display font-bold text-emerald-700 dark:text-emerald-400 text-sm">
            GH₵ {Number(session.total_amount).toFixed(2)}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl p-3">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-500 mb-0.5">Paid</p>
          <p className="font-display font-bold text-blue-700 dark:text-blue-400 text-sm">
            {session.paid_count} students
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary text-sm font-semibold transition-colors group-hover:bg-primary group-hover:text-white">
        Review Session
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  );
}
