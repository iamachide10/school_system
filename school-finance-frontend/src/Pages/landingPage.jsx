import React, { useEffect,useState } from "react";
import { isAuthenticated } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../components/loader";




export default function LandingPage() {
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true)
    if (isAuthenticated()) {
      const role = localStorage.getItem("role");
  
      const redirectMap = {
        teacher: "/classes",
        accountant: "/accountant-dashboard",
        head: "/head-dashboard",
      };
  
      navigate(redirectMap[role] || "/classes", { replace: true });
      setLoading(false)
    }
    setLoading(false)
  }, []);
  
    

  if(loading) return  <FullScreenLoader /> ;



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white">
      {/* Navbar */}

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-green-700 leading-tight">
            Welcome to Lucas Model School Portal
          </h1>

          <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
            A modern and simple school management system that helps administrators,
            teachers, and students access the tools they need — all in one place.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <a
              href="/signin"
              className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition"
            >
              Sign In
            </a>

            <a
              href="/signup"
              className="px-6 py-3 rounded-xl border border-green-600 text-green-700 font-semibold hover:bg-green-50 transition"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 px-6 bg-white border-t border-green-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 bg-green-50 rounded-2xl shadow-sm border border-green-100">
            <h3 className="text-2xl font-bold text-green-700">Manage Classes</h3>
            <p className="text-gray-600 mt-2">Easily organize and access all school classes in one place.</p>
          </div>

          <div className="p-6 bg-green-50 rounded-2xl shadow-sm border border-green-100">
            <h3 className="text-2xl font-bold text-green-700">Track Students</h3>
            <p className="text-gray-600 mt-2">View student profiles, performance, and other information.</p>
          </div>

          <div className="p-6 bg-green-50 rounded-2xl shadow-sm border border-green-100">
            <h3 className="text-2xl font-bold text-green-700">Smart Dashboard</h3>
            <p className="text-gray-600 mt-2">Get insights and manage the school efficiently at a glance.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
