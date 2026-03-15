export default function ActionCard({ title, icon, onClick, disabled = false, helperText }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        group text-left p-5 rounded-2xl border transition-all duration-200
        flex flex-col gap-3 w-full
        ${disabled
          ? "bg-surface border-border text-text-muted cursor-not-allowed opacity-60"
          : "bg-card border-border hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.98]"}
      `}
    >
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center text-xl
        ${disabled ? "bg-border" : "bg-primary/10 group-hover:bg-primary/15 transition-colors"}
      `}>
        {icon}
      </div>
      <div>
        <p className={`font-semibold text-sm ${disabled ? "text-text-muted" : "text-text"}`}>{title}</p>
        {disabled && helperText && (
          <p className="text-xs mt-1 text-text-muted">{helperText}</p>
        )}
      </div>
    </button>
  );
}
