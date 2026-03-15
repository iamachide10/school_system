import { useState } from "react";
import { useAuth } from "../context/authContext";
import { ThemeToggle } from "./ui";
import { Link } from "react-router-dom";

const navLinks = {
  public:  [
    { name: "Log In",         href: "/signin" },
    { name: "Create Account", href: "/signup", type: "button" },
  ],
  private: [
    { name: "Dashboard", href: "/dashboard" },
  ],
};

export default function DashboardNavbar({ isLoggedIn }) {
  const { logOut, user } = useAuth();
  const [open, setOpen] = useState(false);
  const linksToShow = isLoggedIn ? navLinks.private : navLinks.public;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
            LM
          </div>
          <span className="font-display font-bold text-text text-lg leading-none">
            Lucas Model
            <span className="hidden sm:inline text-text-muted font-normal text-sm ml-1">School</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user && (
            <button onClick={logOut}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border hover:border-red-300 text-text-muted hover:text-red-600 dark:hover:text-red-400 text-sm font-semibold transition-all duration-150 active:scale-95">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Log Out
            </button>
          )}
          {linksToShow.map((link, i) =>
            link.type === "button" ? (
              <a key={i} href={link.href}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-all duration-150 active:scale-95">
                {link.name}
              </a>
            ) : (
              <a key={i} href={link.href}
                className="text-text-secondary hover:text-primary text-sm font-semibold transition-colors">
                {link.name}
              </a>
            )
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-text-muted hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/>
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md px-4 py-4 space-y-2 animate-slideDown">
          {user && (
            <button onClick={logOut}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-text-muted hover:text-red-600 font-semibold text-sm transition-colors">
              Log Out
            </button>
          )}
          {linksToShow.map((link, i) =>
            link.type === "button" ? (
              <a key={i} href={link.href} className="block w-full text-center py-2.5 rounded-xl bg-primary text-white font-semibold text-sm">
                {link.name}
              </a>
            ) : (
              <a key={i} href={link.href} className="block w-full py-2.5 text-text-secondary font-semibold text-sm">
                {link.name}
              </a>
            )
          )}
        </div>
      )}
    </nav>
  );
}
