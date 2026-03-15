import { Link } from "react-router-dom";

export const StudentCard = ({ student }) => {
  const initials = student.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link to={`/students/profile/${student.student_code}`}>
      <div className="
        group p-4 bg-card border border-border rounded-2xl
        hover:border-primary/40 hover:shadow-card-hover hover:-translate-y-0.5
        transition-all duration-200 cursor-pointer
        flex items-center gap-4
      ">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
          {initials}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-text truncate">{student.full_name}</h3>
          <p className="text-text-muted text-xs mt-0.5">{student.student_code}</p>
        </div>

        {/* Arrow */}
        <svg className="w-4 h-4 text-text-muted group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-150 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </Link>
  );
};
