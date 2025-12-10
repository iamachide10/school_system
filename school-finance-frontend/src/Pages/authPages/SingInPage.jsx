import React from "react";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import FullScreenLoader from "../../components/loader";



export default function LoginForm() {
    const [email, setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [loading,setLoading]=useState(false)
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const {login}=useAuth()

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    return setError("Please enter your email and password.");
  }

  setLoading(true);
  setError("");
  setSuccess("");

  const url = "https://school-system-backend-78p1.onrender.com/api/users/login";

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ data: { email, password } }),
  };

  try {
    const res = await fetch(url, options);
    const result = await res.json();
    console.log("Login result:", result);

    // 🔥 Handle backend error messages
    if (!res.ok) {

      // Unverified account
      if (result.status === "unverified") {
        return setError(
          "Your email is not verified. Please check your inbox to verify your account."
        );
      }

      // General errors (wrong password, user doesn't exist, etc.)
      return setError(result.message || "Invalid login details.");
    }

    // SUCCESS → Log user in
    login(result.existingUser);

    setSuccess("Login successful! Redirecting...");
    console.log("Logged in:", result);

    // Optional: Redirect after login
  

  } catch (err) {
    console.error("Login error:", err);
    setError("Network error. Please try again.");
  }

  setLoading(false);
};


  if(loading) return <FullScreenLoader/>;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6 border border-green-200">
        <h2 className="text-3xl font-bold text-center text-green-700">Welcome Back</h2>
        <p className="text-center text-gray-600 text-sm">
          Log in to continue to your school portal.
        </p>

        <form onSubmit={e=>handleSubmit(e)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              onChange={e=>setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              onChange={e=>setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 bg-red-100 p-2 rounded">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-600 text-sm mt-2 bg-green-100 p-2 rounded">
              {success}
            </p>
            )}

          <div className="flex justify-end mt-2">
            <a href="/forgot-password" className="text-green-600 text-sm hover:underline">
              Forgot Password?
            </a>
          </div>


          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
          >
            Log In
          </button>


        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-green-700 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
