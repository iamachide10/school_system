import { useNavigate } from "react-router-dom";
import ActionCard from "./ActionCard";
import { ProfileTabs } from "./ProfileTabs";

export function StudentActions({ student }) {
  const navigate = useNavigate();

  if (!student) return null;

  const canPayFees = Number(student.personal?.default_fees) === 5;

  return (
    <main className="bg-background pt-6 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8 animate-fadeUp">

        {/* ── Quick Actions ──────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-primary" />
            <h2 className="font-display text-lg font-bold text-text">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ActionCard
              title="Pay School Fees"
              icon="💳"
              onClick={() => navigate(`/students/${student.personal.index_number}/pay-fees`)}
              disabled={!canPayFees}
              helperText={!canPayFees ? "Not available for this student" : undefined}
            />
            <ActionCard
              title="Transaction History"
              icon="📄"
              onClick={() => navigate(`/students/${student.personal.index_number}/transactions`)}
              disabled={!canPayFees}
              helperText={!canPayFees ? "Not available for this student" : undefined}
            />
          </div>
        </section>

        {/* ── Divider ────────────────────────────── */}
        <div className="border-t border-border" />

        {/* ── Profile Details ────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-primary" />
            <h2 className="font-display text-lg font-bold text-text">Profile Details</h2>
          </div>
          <ProfileTabs student={student} />
        </section>

      </div>
    </main>
  );
}
