
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../components/loader";

import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [valid, setValid] = useState(false);
  const [loading,setLoading]=useState(false)
  const [userId,setUserId]=useState(null)
  const { token } = useParams();

    const navigate = useNavigate();



useEffect(()=>{
      const verifyToken=async ()=>{
        setLoading(true)
        try{
          const res=await fetch(`https://school-system-backend-78p1.onrender.com/api/users/verify_reset_token/${token}`)
             const data = await res.json()
             if(res.ok){
              console.log(data);
              setUserId(data.userId)
              if(data.valid){
                  setValid(true)
              }
            }
        }catch(e){
          console.log(e);
        }
        setLoading(false)
        }
        verifyToken()
},[token])


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirm) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true)
    try{
      const res = await fetch(`${BACKEND_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword,userId})
      });
  
      const data = await res.json();
      if(res.ok){
        window.location.href = "/signin"
      }
    }catch(e){
      console.log(e);
      
    }
    setLoading(false)

  };
   if(loading) return <FullScreenLoader/>;
    
  if (!valid) return <h1 className=" mt-[6rem]  w-full text-center text-3xl font-bold text-red-700">Invalid or expired link</h1>;

  return (
    <div className=" mt-[6rem] max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NEW PASSWORD */}
        <div>
          <label className="font-medium">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="border w-full p-2 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-2 top-2 text-sm text-green-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="font-medium">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              className="border w-full p-2 rounded"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <button
              type="button"
              className="absolute right-2 top-2 text-sm text-green-600"
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          className="mt-4 w-full bg-green-600 text-white p-2 rounded"
          type="submit"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
