import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

/* ── Theme Toggle Button ───────────────────────────── */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        relative inline-flex items-center justify-center w-10 h-10 rounded-full
        bg-surface border border-border text-text-muted
        hover:bg-primary/10 hover:text-primary
        transition-all duration-200 active:scale-95
      "
    >
      {theme === "dark" ? (
        /* Sun icon */
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="5" strokeWidth="2" />
          <path strokeLinecap="round" strokeWidth="2"
            d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        /* Moon icon */
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}

/* ── Auth Card ─────────────────────────────────────── */
export function AuthCard({ children, className = "" }) {
  return (
    <div className={`
      w-full max-w-md
      bg-card border border-border
      shadow-2xl rounded-2xl
      p-8 space-y-6
      animate-fadeUp
      ${className}
    `}>
      {children}
    </div>
  );
}

/* ── Auth Page Wrapper ─────────────────────────────── */
export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
      <div className="w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}

/* ── Logo Mark ─────────────────────────────────────── */
export function LogoMark({ size = "md" }) {
  const sizes = { sm: "w-8 h-8 text-sm", md: "w-11 h-11 text-base", lg: "w-16 h-16 text-xl" };
  return (
    <div className={`
      ${sizes[size]} rounded-xl bg-primary
      flex items-center justify-center
      text-white font-bold tracking-tight shadow-md
    `}>
      LM
    </div>
  );
}

/* ── Input Field ───────────────────────────────────── */
export function InputField({ label, id, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-4 py-2.5
          bg-input border border-border rounded-xl
          text-text placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          transition-all duration-150
          ${error ? "border-red-500 focus:ring-red-400/40" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ── Password Input ────────────────────────────────── */
export function PasswordInput({ label, id, value, onChange, showStrength = false, ...props }) {
  const [show, setShow] = useState(false);

  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = showStrength ? getStrength(value) : 0;
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-emerald-500"];
  const strengthTextColors = ["", "text-red-500", "text-yellow-500", "text-blue-500", "text-emerald-600"];

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="
            w-full px-4 py-2.5 pr-12
            bg-input border border-border rounded-xl
            text-text placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            transition-all duration-150
          "
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      {showStrength && value && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  strength >= i ? strengthColors[strength] : "bg-border"
                }`}
              />
            ))}
          </div>
          <p className={`text-xs font-medium ${strengthTextColors[strength]}`}>
            {strengthLabels[strength]}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Status Message ────────────────────────────────── */
export function StatusMessage({ type, message }) {
  if (!message) return null;

  const styles = {
    error: "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400",
    success: "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
    warning: "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400",
    info: "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400",
  };

  const icons = {
    error: (
      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm font-medium animate-fadeIn ${styles[type]}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
}

/* ── Primary Button ────────────────────────────────── */
export function PrimaryButton({ children, loading, className = "", ...props }) {
  return (
    <button
      disabled={loading}
      className={`
        relative w-full py-3 px-6
        bg-primary hover:bg-primary-dark
        text-white font-semibold rounded-xl
        shadow-lg shadow-primary/25
        transition-all duration-200
        active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

/* ── Select Field ──────────────────────────────────── */
export function SelectField({ label, id, children, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          w-full px-4 py-2.5
          bg-input border border-border rounded-xl
          text-text
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          transition-all duration-150 cursor-pointer
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
