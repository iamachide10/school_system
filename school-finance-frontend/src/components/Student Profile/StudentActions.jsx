import { useNavigate } from "react-router-dom";
import ActionCard from "./ActionCard";
import { ProfileTabs } from "./ProfileTabs";

export function StudentActions({ student }) {
  const navigate = useNavigate();

  if (!student) return null;

  const canPayFees = Number(student.personal?.default_fees) === 5;

  return (
    <main className="p-6 space-y-8">
      {/* ACTIONS */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Student Actions</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* PAY FEES */}
          <ActionCard
            title="Pay School Fees"
            icon="💳"
            onClick={() =>
              navigate(`/students/${student.personal.index_number}/pay-fees`)
            }
            disabled={!canPayFees}
            helperText={
              !canPayFees
                ? "Fees not available for this student"
                : undefined
            }
          />

          {/* TRANSACTION HISTORY */}
          <ActionCard
            title="Transaction History"
            icon="📄"
            onClick={() =>
              navigate(`/students/${student.personal.index_number}/transactions`)
            }
            disabled={!canPayFees}
            helperText={
              !canPayFees
                ? "Fees not available for this student"
                : undefined
            }
          />
        </div>
      </section>

      <ProfileTabs student={student} />
    </main>
  );
}
