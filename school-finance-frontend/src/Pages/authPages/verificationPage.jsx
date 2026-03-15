import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import FullScreenLoader from "../../components/loader";
import BACKEND_URL from "../../utils/backend";
import { AuthLayout, AuthCard, LogoMark } from "../../components/ui";

const EmailVerification = () => {
  const { token } = useParams();
  const { login } = useAuth();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/verify_email/${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          login(data);
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };
    verifyToken();
  }, [token]);

  return (
    <AuthLayout>
      <AuthCard>
        <div className="flex flex-col items-center gap-3 text-center">
          <LogoMark />
        </div>

        <div className="flex flex-col items-center gap-5 text-center py-4 animate-fadeIn">
          {/* Loading */}
          {status === "loading" && (
            <>
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div>
                <h2 className="font-display text-2xl font-bold text-text">Verifying your email…</h2>
                <p className="text-text-muted text-sm mt-1">Please wait while we confirm your account.</p>
              </div>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center animate-fadeIn">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="font-display text-3xl font-bold text-text">Email Verified!</h2>
                <p className="text-text-muted text-sm mt-2 max-w-xs">
                  Your email has been confirmed. You're now signed in and ready to go.
                </p>
              </div>
              <button
                onClick={() => navigate("/classes")}
                className="
                  mt-2 w-full py-3 rounded-xl
                  bg-primary hover:bg-primary-dark text-white font-semibold
                  transition-all duration-200 active:scale-[0.98]
                  shadow-lg shadow-primary/25
                  flex items-center justify-center gap-2
                "
              >
                Go to Dashboard
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center animate-fadeIn">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-text">Verification Failed</h2>
                <p className="text-text-muted text-sm mt-2 max-w-xs">
                  This verification link is invalid or has expired. Please request a new one below.
                </p>
              </div>
              <div className="w-full space-y-3">
                <button
                  onClick={() => navigate("/signin")}
                  className="
                    w-full py-3 rounded-xl
                    bg-primary hover:bg-primary-dark text-white font-semibold
                    transition-all duration-200 active:scale-[0.98]
                    shadow-lg shadow-primary/25
                  "
                >
                  Resend Verification Email
                </button>
                <a
                  href="/signin"
                  className="block text-sm text-text-muted hover:text-primary text-center transition-colors font-medium"
                >
                  Back to Sign In
                </a>
              </div>
            </>
          )}
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default EmailVerification;
