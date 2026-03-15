import { useState } from "react";
import BACKEND_URL from "../../utils/backend";
import FullScreenLoader from "../../components/loader";
import {
  AuthLayout, AuthCard, LogoMark,
  InputField, StatusMessage, PrimaryButton,
} from "../../components/ui";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email address.");

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/request-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        setSuccess(data.msg || "Reset link sent! Check your inbox.");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
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
          {sent ? (
            <>
              {/* Success state */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center animate-fadeIn">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-text">Check your inbox</h2>
                <p className="text-text-muted text-sm mt-1 max-w-xs">
                  We sent a password reset link to <strong className="text-text">{email}</strong>
                </p>
              </div>
            </>
          ) : (
            <div>
              <h2 className="font-display text-3xl font-bold text-text">Forgot password?</h2>
              <p className="text-text-muted text-sm mt-1">
                No worries — we'll send you reset instructions.
              </p>
            </div>
          )}
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email address"
              id="email"
              type="email"
              placeholder="you@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <StatusMessage type="error" message={error} />
            <StatusMessage type="success" message={success} />

            <PrimaryButton loading={loading} type="submit">
              Send Reset Link
            </PrimaryButton>
          </form>
        ) : (
          <div className="space-y-4">
            <StatusMessage type="success" message={success} />
            <p className="text-center text-sm text-text-muted">
              Didn't receive it?{" "}
              <button
                onClick={() => { setSent(false); setSuccess(""); }}
                className="text-primary font-semibold hover:underline"
              >
                Try again
              </button>
            </p>
          </div>
        )}

        <div className="text-center">
          <a href="/signin" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Sign In
          </a>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
