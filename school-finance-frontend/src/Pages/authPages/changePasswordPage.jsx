import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../components/loader";
import BACKEND_URL from "../../utils/backend";
import {
  AuthLayout, AuthCard, LogoMark,
  PasswordInput, StatusMessage, PrimaryButton,
} from "../../components/ui";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://school-system-backend-78p1.onrender.com/api/users/verify_reset_token/${token}`
        );
        const data = await res.json();
        if (res.ok) {
          setUserId(data.userId);
          if (data.valid) setValid(true);
        }
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirm) return setError("Please fill in both fields.");
    if (newPassword !== confirm) return setError("Passwords do not match.");
    if (newPassword.length < 8) return setError("Password must be at least 8 characters.");

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/reset_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset successfully! Redirecting to sign in…");
        setTimeout(() => navigate("/signin"), 2500);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  if (loading) return <FullScreenLoader />;

  /* Invalid / expired token */
  if (!valid) {
    return (
      <AuthLayout>
        <AuthCard>
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-text">Link Expired</h2>
              <p className="text-text-muted text-sm mt-2 max-w-xs">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
            </div>
            <a
              href="/forgot-password"
              className="mt-2 w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-center transition-all duration-200 active:scale-[0.98]"
            >
              Request New Link
            </a>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard>
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <LogoMark />
          <div>
            <h2 className="font-display text-3xl font-bold text-text">Reset password</h2>
            <p className="text-text-muted text-sm mt-1">Choose a new, strong password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordInput
            label="New Password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            showStrength
          />

          <PasswordInput
            label="Confirm Password"
            id="confirm-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
          />

          {/* Match indicator */}
          {confirm && (
            <div className="flex items-center gap-2 text-sm animate-fadeIn">
              {newPassword === confirm ? (
                <>
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-emerald-600 font-medium">Passwords match</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-500 font-medium">Passwords don't match</span>
                </>
              )}
            </div>
          )}

          <StatusMessage type="error" message={error} />
          <StatusMessage type="success" message={success} />

          <PrimaryButton loading={loading} type="submit">
            Reset Password
          </PrimaryButton>
        </form>

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
