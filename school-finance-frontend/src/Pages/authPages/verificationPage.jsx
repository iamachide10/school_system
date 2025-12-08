import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";


const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const {login}=useAuth()
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    const verifyToken = async () => {
      console.log(token);
      
      try {
        const res = await fetch(`https://school-system-backend-78p1.onrender.com/api/users/verify_email/${token}`)
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          alert("Email verified successfully!");
          console.log(data);
          login(data)

          // OPTIONAL: auto login here if you want
          // navigate("/dashboard")
        } else {
          setStatus("error");
          
        }
      } catch (err) {
        setStatus("error");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-green-200 text-center space-y-6">

        {/* Loading State */}
        {status === "loading" && (
          <>
            <div className="animate-spin mx-auto border-4 border-green-300 border-t-green-600 rounded-full h-14 w-14"></div>
            <h2 className="text-2xl font-bold text-green-700">Verifying Email…</h2>
            <p className="text-gray-600 text-sm">Please wait while we confirm your account.</p>
          </>
        )}

        {/* Success UI */}
        {status === "success" && (
          <>
            <div className="text-green-600 mx-auto text-5xl">✔</div>
            <h2 className="text-3xl font-bold text-green-700">Email Verified!</h2>
            <p className="text-gray-600 text-sm">
              Your email has been successfully verified. You can now log in.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-lg font-semibold"
            >
              Continue to Login
            </button>
          </>
        )}

        {/* Error UI */}
        {status === "error" && (
          <>
            <div className="text-red-600 mx-auto text-5xl">✖</div>
            <h2 className="text-3xl font-bold text-red-600">Verification Failed</h2>
            <p className="text-gray-600 text-sm">
              The verification link is invalid or expired.
            </p>

            <button
              onClick={() => navigate("/resend-verification")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-lg font-semibold"
            >
              Resend Verification Email
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
