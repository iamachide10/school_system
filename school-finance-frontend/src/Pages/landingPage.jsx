import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../components/loader";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Manage Classes",
    description: "Organize and access all school classes in one intuitive interface. Create sessions, track progress, and manage schedules effortlessly.",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-100 dark:border-emerald-900/40",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Track Students",
    description: "View full student profiles, monitor academic performance, manage fees, and keep detailed records — all in one place.",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-100 dark:border-blue-900/40",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Smart Dashboard",
    description: "Get real-time insights into school performance. Powerful analytics for headmasters, accountants, and teachers in role-based views.",
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-100 dark:border-violet-900/40",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Fee Management",
    description: "Process school fee payments, track transaction history, and generate financial reports with a few clicks.",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-100 dark:border-amber-900/40",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: "Score Recording",
    description: "Record and manage exam scores efficiently. Track academic performance over time with detailed reporting per subject and class.",
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-100 dark:border-rose-900/40",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Role-Based Access",
    description: "Secure, permission-based access for teachers, accountants, and headmasters. Everyone sees exactly what they need.",
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "border-teal-100 dark:border-teal-900/40",
  },
];

const stats = [
  { value: "500+", label: "Students Managed" },
  { value: "30+", label: "Active Classes" },
  { value: "99%", label: "Uptime" },
  { value: "3", label: "User Roles" },
];

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated()) {
      const role = localStorage.getItem("role");
      const redirectMap = {
        teacher: "/classes",
        accountant: "/accountant-dashboard",
        head: "/head-dashboard",
      };
      navigate(redirectMap[role] || "/classes", { replace: true });
    }
    setLoading(false);
    requestAnimationFrame(() => setVisible(true));
  }, []);

  if (loading) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-16 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-emerald-300/10 blur-2xl" />
          <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-emerald-400/10 blur-2xl" />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.025] dark:opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className={`relative max-w-3xl mx-auto text-center space-y-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            School Management System
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-extrabold text-text leading-[1.05] tracking-tight">
            Lucas Model
            <span className="block text-primary">School Portal</span>
          </h1>

          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            A modern school management platform that brings administrators,
            teachers, and accountants together — streamlining everything from
            class management to fee processing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="/signin"
              className="
                w-full sm:w-auto px-8 py-3.5 rounded-xl
                bg-primary hover:bg-primary-dark
                text-white font-semibold text-base
                shadow-lg shadow-primary/25
                transition-all duration-200 active:scale-95
                flex items-center justify-center gap-2
              "
            >
              Sign In
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="/signup"
              className="
                w-full sm:w-auto px-8 py-3.5 rounded-xl
                border-2 border-border hover:border-primary/40
                bg-card hover:bg-primary/5
                text-text font-semibold text-base
                transition-all duration-200 active:scale-95
                flex items-center justify-center
              "
            >
              Create Account
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted animate-float">
          <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Stats Strip ───────────────────────────── */}
      <section className="py-12 border-y border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="font-display text-4xl font-extrabold text-primary">{s.value}</div>
              <div className="text-sm text-text-muted font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest">Everything You Need</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text">
              Built for every role in your school
            </h2>
            <p className="text-text-secondary text-lg">
              Purpose-built tools for teachers, headmasters, and accountants — all in one unified platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className={`
                  group p-6 rounded-2xl border ${f.border} ${f.bg}
                  hover:shadow-card-hover hover:-translate-y-1
                  transition-all duration-300 cursor-default
                `}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-card shadow-card mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className={`font-display text-xl font-bold mb-2 ${f.color}`}>{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-primary overflow-hidden p-12 text-center text-white space-y-6">
            {/* BG decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black/10 translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <h2 className="font-display text-3xl md:text-5xl font-bold">Ready to get started?</h2>
              <p className="mt-3 text-emerald-100 text-lg max-w-xl mx-auto">
                Join the Lucas Model School portal today and bring your school management into the modern era.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <a
                  href="/signup"
                  className="px-8 py-3.5 rounded-xl bg-white text-primary font-bold hover:bg-emerald-50 transition-all duration-200 active:scale-95"
                >
                  Get Started Free
                </a>
                <a
                  href="/signin"
                  className="px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200 active:scale-95"
                >
                  Sign In Instead
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="border-t border-border py-8 px-6 text-center text-text-muted text-sm">
        © {new Date().getFullYear()} Lucas Model School Portal. All rights reserved.
      </footer>
    </div>
  );
}
