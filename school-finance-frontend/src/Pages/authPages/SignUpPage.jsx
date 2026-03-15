import { useState, useEffect } from "react";
import FullScreenLoader from "../../components/loader";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../context/authContext";
import BACKEND_URL from "../../utils/backend";
import {
  AuthLayout, AuthCard, LogoMark,
  InputField, PasswordInput, SelectField,
  StatusMessage, PrimaryButton,
} from "../../components/ui";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [selectedClassId, setSelectedClass] = useState(0);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const isTeacher = role === "teacher";

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated()) {
      const redirectMap = {
        teacher: "/classes",
        accountant: "/accountant-dashboard",
        headmaster: "/head-dashboard",
      };
      navigate(redirectMap[role], { replace: true });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const getClasses = async () => {
      setLoading(true);
      try {
        const req = await fetch(`${BACKEND_URL}/api/classes/getallclasses`);
        const data = await req.json();
        if (req.ok) setClasses(data.result);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    getClasses();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) return setError("Please fill all fields.");
    if (role === "teacher" && !selectedClassId) return setError("Please select a class for the teacher.");

    setLoading(true);
    setError("");
    setSuccess("");

    const payload = { name, email, password, role, ...(role === "teacher" && { selectedClassId }) };

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setLoading(false);
        return setError(result.message || "Something went wrong.");
      }

      setSuccess(`${result.message}. Please check your email to verify your account.`);
      setName(""); setEmail(""); setPassword(""); setRole(""); setSelectedClass("");
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
          <div>
            <h2 className="font-display text-3xl font-bold text-text">Create account</h2>
            <p className="text-text-muted text-sm mt-1">Join the school portal today</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">
          <InputField
            label="Full Name"
            id="name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />

          <InputField
            label="Email address"
            id="email"
            type="email"
            placeholder="you@school.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <PasswordInput
            label="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a strong password"
            autoComplete="new-password"
            showStrength
          />

          <SelectField
            label="Select Role"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">— Choose your role —</option>
            <option value="teacher">Teacher</option>
            <option value="accountant">Accountant</option>
            <option value="headmaster">Headmaster</option>
            <option value="other">Other</option>
          </SelectField>

          {isTeacher && (
            <div className="animate-slideDown">
              <SelectField
                label="Assign Class"
                id="class"
                value={selectedClassId}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">— Select a class —</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </SelectField>
            </div>
          )}

          <StatusMessage type="error" message={error} />
          <StatusMessage type="success" message={success} />

          <PrimaryButton loading={loading} type="submit">
            Create Account
          </PrimaryButton>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-4 text-xs text-text-muted">Already have an account?</span>
          </div>
        </div>

        <a
          href="/signin"
          className="
            block w-full py-2.5 text-center rounded-xl
            border-2 border-border hover:border-primary/40
            text-text font-semibold text-sm
            hover:bg-primary/5 transition-all duration-200
          "
        >
          Sign in instead
        </a>
      </AuthCard>
    </AuthLayout>
  );
};

export default SignUp;
