import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import FullScreenLoader from "./loader";
import BACKEND_URL from "../utils/backend";



// Dynamic links object
const navLinks = {
  public: [
    { name: "Log In", href: "/signin" },
    { name: "Create Account", href: "/signup", type: "button" },
  ],
  private: [
    { name: "Dashboard", href: "/dashboard" },
  ],
};

export default function Navbar({ isLoggedIn }) {
  const {logOut ,user} =useAuth()
  const [open, setOpen] = useState(false);
  const [loading,setLoading]=useState(false)
  const linksToShow = isLoggedIn ? navLinks.private : navLinks.public;

  const logOutFunction=async()=>{
    const url=`${BACKEND_URL}/api/users/logout`
    const options={
        method:"POST",
        credentials:"include",
    }
    try{
      setLoading(true)
        const res= await fetch(url ,options)
        const data= await res.json()
        if(res.ok){
          setLoading(false)
            console.log(data.message);
            logOut()
        }
    }catch(e){
        console.log(e);
    }
    setLoading(false)
  }

  if(loading) return <FullScreenLoader/>;


  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/60 border-b border-green-200 shadow-sm z-50 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-green-700">Lucas Model School</h1>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {
            user &&
            <button  onClick={logOutFunction}>
                <a
                className="block w-full bg-green-600 text-white px-4 py-2 rounded-xl shadow-md"
              >
                Log Out 
              </a>
          </button>
          }
          {linksToShow.map((link, index) => (
            link.type === "button" ? (
              <a
                key={index}
                href={link.href}
                className="bg-green-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-green-700 transition"
              >
                {link.name}
              </a>
            ) : (
              <a
                key={index}
                href={link.href}
                className="text-green-700 font-semibold hover:text-green-800 transition"
              >
                {link.name}
              </a>
            )
          ))}
        </div>

        {/* Mobile Menu Trigger */}
        <button className="md:hidden text-green-700" onClick={() => setOpen(!open)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-3 bg-white/70 backdrop-blur-md rounded-xl shadow px-4 py-4 space-y-4 border border-green-100">
          {
            user &&
            <button  onClick={logOutFunction}>
                <a
                className="block w-full bg-green-600 text-white px-4 py-2 rounded-xl shadow-md"
              >
                Log Out 
              </a>
          </button>
          }
          {linksToShow.map((link, index) => (
            link.type === "button" ? (
              <a
                key={index}
                href={link.href}
                className="block w-full bg-green-600 text-white px-4 py-2 rounded-xl shadow-md"
              >
                {link.name}
              </a>
            ) : (
              <a
                key={index}
                href={link.href}
                className="block w-full text-left text-green-700 font-semibold"
              >
                {link.name}
              </a>
            )
          ))}
        </div>
      )}
    </nav>
  );
}