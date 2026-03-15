export function StudentProfileHeader({ student }) {
  const initials = student.personal.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative bg-primary overflow-hidden pt-20 pb-8 px-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/10 translate-y-1/2 -translate-x-1/2 pointer-events-none" aria-hidden />

      <div className="relative max-w-3xl mx-auto flex items-center gap-5">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-display font-bold text-xl shrink-0">
          {initials}
        </div>

        {/* Info */}
        <div>
          <p className="text-emerald-200 text-xs font-semibold uppercase tracking-widest mb-1">
            Student Profile
          </p>
          <h1 className="font-display text-2xl font-bold text-white leading-tight">
            {student.personal.full_name}
          </h1>
          <p className="text-emerald-200 text-sm mt-0.5">
            {student.personal.index_number}
          </p>
        </div>
      </div>
    </div>
  );
}
