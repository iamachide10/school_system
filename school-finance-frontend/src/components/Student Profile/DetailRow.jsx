import { useState, useEffect } from "react";

export function DetailRow({ label, value, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => { setInputValue(value); }, [value]);

  function handleSave() {
    setIsEditing(false);
    onSave?.(inputValue);
  }

  function handleCancel() {
    setInputValue(value);
    setIsEditing(false);
  }

  return (
    <div className="py-4 border-b border-border last:border-0">
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">{label}</p>

      {!isEditing ? (
        <div className="flex items-center justify-between gap-4">
          <p className="font-medium text-text">{value || <span className="text-text-muted italic">Not set</span>}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Edit
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            className="
              w-full px-4 py-2.5
              bg-input border border-border rounded-xl
              text-text text-sm placeholder:text-text-muted
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
              transition-all duration-150
            "
          />
          <div className="flex gap-2">
            <button onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-colors active:scale-[0.98]">
              Save
            </button>
            <button onClick={handleCancel}
              className="px-4 py-2 rounded-xl border border-border text-text-muted hover:text-text text-xs font-semibold transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
