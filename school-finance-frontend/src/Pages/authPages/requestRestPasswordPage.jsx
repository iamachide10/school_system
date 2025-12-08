import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://school-system-backend-78p1.onrender.com/api/users/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    alert(data.msg);
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-[6rem]">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          className="border w-full p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="mt-4 w-full bg-green-600 text-white p-2 rounded"
          type="submit"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
