import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../../utils/backend";
import {
  AuthLayout, AuthCard, LogoMark,
  InputField, SelectField,
  StatusMessage, PrimaryButton,
} from "../../components/ui";

export const CreateClass = () => {
  const [className, setClassName] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!className || !classNumber) {
      return setError("Please fill in all fields.");
    }

    setLoading(true);
    try {
      const result = await fetch(`${BACKEND_URL}/api/classes/create_class`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ className, classNumber }),
      });

      if (result.ok) {
        setSuccess(`"${className}" has been created successfully.`);
        setClassName("");
        setClassNumber("");
      } else {
        const data = await result.json();
        setError(data.message || "Failed to create class.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <AuthCard>
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <LogoMark />
          <div>
            <h2 className="font-display text-3xl font-bold text-text">Create New Class</h2>
            <p className="text-text-muted text-sm mt-1">Add a class to the school portal</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Class Name"
            id="className"
            type="text"
            placeholder="e.g. Basic 1, JHS 2, SHS 3"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            autoFocus
          />

          <SelectField
            label="Class Number"
            id="classNumber"
            value={classNumber}
            onChange={(e) => setClassNumber(e.target.value)}
          >
            <option value="">— Select class number —</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </SelectField>

          <StatusMessage type="error" message={error} />
          <StatusMessage type="success" message={success} />

          <PrimaryButton loading={loading} type="submit">
            Create Class
          </PrimaryButton>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};
