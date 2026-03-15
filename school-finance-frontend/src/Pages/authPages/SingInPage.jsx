import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import FullScreenLoader from "../../components/loader";
import { isAuthenticated } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../../utils/backend";
import {
  AuthLayout, AuthCard, LogoMark,
  InputField, PasswordInput,
  StatusMessage, PrimaryButton,
} from "../../components/ui";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showVerifyBox, setShowVerifyBox] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated()) {
      const role = localStorage.getItem("role");
      const redirectMap = {
        teacher: "/classes",
        accountant: "/accountant-dashboard",
        headmaster: "/head-dashboard",
      };
      navigate(redirectMap[role], { replace: true });
    }
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please enter your email and password.");

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ data: { email, password } }),
      });
      const result = await res.json();

      if (!res.ok) {
        setLoading(false);
        if (result.status === "unverified") {
          setUnverifiedEmail(email);
          setShowVerifyBox(true);
          return setError("Your email is not verified. Please resend the verification email.");
        }
        return setError(result.message || "Invalid login details.");
      }

      login(result);
      setSuccess("Login successful! Redirecting…");
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/resend_verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unverifiedEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSuccess("");
        setShowVerifyBox(false);
        return setError(data.message || "Something went wrong.");
      }
      setShowVerifyBox(false);
      setError("");
      setSuccess(data.message);
    } catch {
      setError("Error sending verification email.");
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
            <h2 className="font-display text-3xl font-bold text-text">Welcome back</h2>
            <p className="text-text-muted text-sm mt-1">Sign in to your school portal</p>
          </div>
        </div>

        {/* Form */}
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

          <div className="space-y-1">
            <PasswordInput
              label="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <div className="flex justify-end pt-1">
              <a
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Status messages */}
          <StatusMessage type="error" message={error} />
          <StatusMessage type="success" message={success} />

          {/* Unverified email box */}
          {showVerifyBox && (
            <div className="animate-slideDown rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">
                  Please verify your email address to continue.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResend}
                className="
                  w-full py-2 rounded-lg text-sm font-semibold
                  bg-amber-600 hover:bg-amber-700 text-white
                  transition-colors duration-150 active:scale-[0.98]
                "
              >
                Resend Verification Email
              </button>
            </div>
          )}

          <PrimaryButton loading={loading} type="submit">
            Sign In
          </PrimaryButton>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-4 text-xs text-text-muted">Don't have an account?</span>
          </div>
        </div>

        <a
          href="/signup"
          className="
            block w-full py-2.5 text-center rounded-xl
            border-2 border-border hover:border-primary/40
            text-text font-semibold text-sm
            hover:bg-primary/5 transition-all duration-200
          "
        >
          Create an account
        </a>
      </AuthCard>
    </AuthLayout>
  );
}
