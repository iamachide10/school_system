import React from "react";
import { useState } from "react";
import { useAuth } from "../../context/authContext";



export default function LoginForm() {
    const [email, setEmail]=useState("")
    const [password,setPassword]=useState("")


    const {login}=useAuth()

  const handleSubmit=async(e)=>{
        e.preventDefault()  
        if( !email || !password ) return alert("Fill all options")
        const data={
            email,
            password,
        } 


        const url = "https://school-system-backend-78p1.onrender.com/api/users/login"
        const option ={
          method:"POST" ,
          headers:{
            "Content-Type":"application/json"
          },
          credentials:"include",
          body:JSON.stringify({data})
        } 
        try{
          const res= await fetch(url ,option)
          const data=await res.json()
          if(res.ok){
            login(data)
            console.log(data);
          }

        }catch(e){
          console.log(e);
        }
  }
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
