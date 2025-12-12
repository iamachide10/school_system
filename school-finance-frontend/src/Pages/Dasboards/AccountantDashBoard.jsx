import { useEffect, useState } from "react";
//import { Card, CardContent } from "@/components/ui/card";
import SessionCard from "../../components/sessionCard";
import FullScreenLoader from "../../components/loader";
import { isAuthenticated } from "../../context/authContext";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

export default function AccountDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const {role}=useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    if (isAuthenticated()) {
  
      const redirectMap = {
        teacher: "/classes",
        accountant: "/accountant-dashboard",
        headmaster: "/head-dashboard",
      };
  
      navigate(redirectMap[role] , { replace: true });
      setLoading(false)
    }
    setLoading(false)
  }, []);
  
    


  useEffect(() => {
    fetchPendingSessions();
    
  }, []);

  const fetchPendingSessions = async () => {
    setLoading(true)
    try {
      const res = await fetch("https://school-system-backend-78p1.onrender.com/api/session/get_pending_session");
      const data = await res.json();

      if (data.result) {
        setSessions(data.result);
      } else {
        setMessage("No pending sessions.");
      }
    } catch (err) {
      setMessage("Failed to load sessions.");
    }
    setLoading(false);
  };

  if(loading) return <FullScreenLoader/>;

  return (
    <div className="mt-[4rem] min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Account Dashboard</h1>

      {loading && <p className="text-green-700">Loading...</p>}
      {message && <p className="text-red-600">{message}</p>}
      {sessions.length===0 && <p className="mt-[2rem] text-red-600">No pending sessions</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <SessionCard key={session.session_id} session={session} />
        ))}
      </div>
    </div>
  );
}
