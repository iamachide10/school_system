import { useState } from "react";
import BACKEND_URL from "../../utils/backend";

export function PersonalDetails({ data }) {
  const [fullName, setFullName]         = useState(data.full_name);
  const [fees, setFees]                 = useState(data.default_fees);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingFees, setIsEditingFees] = useState(false);
  const [saving, setSaving]             = useState(false);

  async function updateStudent(field, value) {
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/student/update/${data.index_number}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const result = await res.json();
      if (!res.ok) { console.error(result.message || "Update failed"); return false; }
      setFullName(result.student.full_name);
      setFees(result.student.default_fees);
      window.location.href = `/students/profile/${data.index_number}`;
      return true;
    } catch (err) {
      console.error("Update error:", err);
      return false;
    } finally {
      setSaving(false);
    }
  }

  const fieldClass = `
    w-full px-4 py-2.5
    bg-input border border-border rounded-xl
    text-text text-sm placeholder:text-text-muted
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    transition-all duration-150
  `;

  const saveBtn = "px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-colors active:scale-[0.98] disabled:opacity-60";
  const cancelBtn = "px-4 py-2 rounded-xl border border-border text-text-muted hover:text-text text-xs font-semibold transition-colors";

  return (
    <div className="divide-y divide-border">

      {/* Index Number — read only */}
      <div className="py-4">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">Index Number</p>
        <p className="font-medium text-text">{data.index_number}</p>
      </div>

      {/* Full Name */}
      <div className="py-4">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Full Name</p>
        {!isEditingName ? (
          <div className="flex items-center justify-between gap-4">
            <p className="font-medium text-text">{fullName}</p>
            <button onClick={() => setIsEditingName(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} autoFocus className={fieldClass} />
            <div className="flex gap-2">
              <button disabled={saving} onClick={async () => { const ok = await updateStudent("full_name", fullName); if (ok) setIsEditingName(false); }} className={saveBtn}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={() => { setFullName(data.full_name); setIsEditingName(false); }} className={cancelBtn}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Default Fees */}
      <div className="py-4">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Default Fees</p>
        {!isEditingFees ? (
          <div className="flex items-center justify-between gap-4">
            <p className="font-medium text-text">₵{fees}</p>
            <button onClick={() => setIsEditingFees(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              {[5, 11].map((amount) => (
                <button key={amount} onClick={() => setFees(amount)}
                  className={`px-5 py-2 rounded-xl border text-sm font-semibold transition-all duration-150 active:scale-[0.98]
                    ${fees === amount
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/25"
                      : "bg-card border-border text-text hover:border-primary/40"
                    }`}>
                  ₵{amount}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button disabled={saving} onClick={async () => { const ok = await updateStudent("default_fees", fees); if (ok) setIsEditingFees(false); }} className={saveBtn}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={() => { setFees(data.default_fees); setIsEditingFees(false); }} className={cancelBtn}>Cancel</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
