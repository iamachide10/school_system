import { Link } from "react-router-dom";

export const ClassCard = ({ item }) => {
  return (
    <Link to={`/classes/${item.id}/${item.name}`}>
      <div className="
        group p-5 bg-card border border-border rounded-2xl
        hover:border-primary/40 hover:shadow-card-hover hover:-translate-y-0.5
        transition-all duration-200 cursor-pointer
      ">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <svg className="w-4 h-4 text-text-muted group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-150 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
        <div className="mt-3">
          <h3 className="font-display text-lg font-bold text-text">{item.name}</h3>
          <p className="text-text-muted text-sm mt-0.5">
            {item.teacher_name ? item.teacher_name : "No teacher assigned"}
          </p>
        </div>
      </div>
    </Link>
  );
};
