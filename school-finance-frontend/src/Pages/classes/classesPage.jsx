import { useEffect, useState } from "react";
import { ClassCard } from "../../components/classCard";
import FullScreenLoader from "../../components/loader";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../context/authContext";
import { useAuth } from "../../context/authContext";
import BACKEND_URL from "../../utils/backend";

export const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated()) {
      const redirectMap = {
        teacher: "/classes",
        accountant: "/accountant-dashboard",
        headmaster: "/head-dashboard",
      };
      navigate(redirectMap[role], { replace: true });
    } else {
      navigate("/");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const getAllClasses = async () => {
      setLoading(true);
      try {
        const result = await fetch(`${BACKEND_URL}/api/classes/getallclasses`);
        const data = await result.json();
        if (result.ok) setClasses(data.result);
      } catch (e) {
        console.log("Error:", e);
      }
      setLoading(false);
    };
    getAllClasses();
  }, []);

  const filtered = classes.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8 animate-fadeUp">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-1">
              School Portal
            </p>
            <h1 className="font-display text-4xl font-bold text-text">All Classes</h1>
            <p className="text-text-muted text-sm mt-1">
              {classes.length} class{classes.length !== 1 ? "es" : ""} available
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search classes…"
              className="
                w-full pl-10 pr-4 py-2.5
                bg-card border border-border rounded-xl
                text-text text-sm placeholder:text-text-muted
                focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                transition-all duration-150
              "
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <ClassCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-text">
              {search ? "No classes match your search" : "No classes yet"}
            </h3>
            <p className="text-text-muted text-sm max-w-xs">
              {search
                ? "Try a different search term."
                : "Classes will appear here once they've been created."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm text-primary font-semibold hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
