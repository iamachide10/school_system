import { useState } from "react";
import FullScreenLoader from "../../components/loader";
import { useParams, useNavigate } from "react-router-dom";
import BACKEND_URL from "../../utils/backend";
import {
  AuthLayout, AuthCard, LogoMark,
  InputField, SelectField,
  StatusMessage, PrimaryButton,
} from "../../components/ui";

export const AddStudent = () => {
  const [fullName, setFullName] = useState("");
  const [defaultFee, setDefaultFee] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { class_id, class_name } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!fullName || !defaultFee) {
      return setError("Please fill in all fields.");
    }

    setLoading(true);
    const data = { selectedClassId: class_id, defaultFee, fullName };

    try {
      const res = await fetch(`${BACKEND_URL}/api/student/create_student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(`${fullName} has been added successfully.`);
        setFullName("");
        setDefaultFee("");
      } else {
        const result = await res.json();
        setError(result.message || "Failed to add student.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
      console.log(e);
    }
    setLoading(false);
  };

  if (loading) return <FullScreenLoader />;

  return (
    <AuthLayout>
      <AuthCard>
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <LogoMark />
          <div>
            <h2 className="font-display text-3xl font-bold text-text">Add New Student</h2>
            <p className="text-text-muted text-sm mt-1">
              Registering into{" "}
              <span className="font-semibold text-primary">{class_name}</span>
            </p>
          </div>
        </div>

        {/* Class badge */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Assigned Class</p>
            <p className="text-sm font-semibold text-text">{class_name}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Full Name"
            id="fullName"
            type="text"
            placeholder="e.g. Ama Serwaa"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoFocus
          />

          <SelectField
            label="Default Fees"
            id="defaultFee"
            value={defaultFee}
            onChange={(e) => setDefaultFee(e.target.value)}
          >
            <option value="">— Select default fee —</option>
            <option value="11">₵11</option>
            <option value="5">₵5</option>
          </SelectField>

          <StatusMessage type="error" message={error} />
          <StatusMessage type="success" message={success} />

          <PrimaryButton loading={loading} type="submit">
            Add Student
          </PrimaryButton>
        </form>

        {/* Back link */}
        <div className="text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to class
          </button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};
