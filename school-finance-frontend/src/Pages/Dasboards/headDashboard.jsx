import { useEffect, useState } from "react";
import FullScreenLoader from "../../components/loader";
import { DollarSign, AlertTriangle, Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../context/authContext";
import { useAuth } from "../../context/authContext";

export default function HeadmistressDashboard() {
  const [loading,setLoading]=useState(false)
  const {role}=useAuth()
  const [stats, setStats] = useState({
    today: 0,
    month: 0,
    pending: 0,
  }); 



    const navigate = useNavigate()
  
    useEffect(() => {
      setLoading(true)
      if (isAuthenticated()) {
    
        const redirectMap = {
          teacher: "/classes",
          accountant: "/accountant-dashboard",
          headmaster: "/head-dashboard",
        };
    
        navigate(redirectMap[role] || "/classes", { replace: true });
        setLoading(false)
      }
      setLoading(false)
    }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const res = await fetch("https://school-system-backend-78p1.onrender.com/admin/dashboard/summary");
        const data = await res.json();
        console.log(data);
        
        setStats(data.summary);
      } catch (error) {
        console.error("Error fetching headmistress stats", error);
      }
      setLoading(false)
    };
    fetchStats();
  }, []);
  
  if(loading) return <FullScreenLoader/>;


  return (
    <div className="mt-[6rem] p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Today Revenue */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200 flex items-center gap-4">
        <div className="bg-green-100 p-3 rounded-xl">
          <DollarSign size={26} className="text-green-700" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Collected Today</p>
          <h2 className="text-2xl font-bold text-gray-800">GH₵ {stats.today}</h2>
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200 flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-xl">
          <DollarSign size={26} className="text-blue-700" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Collected This Month</p>
          <h2 className="text-2xl font-bold text-gray-800">GH₵ {stats.month}</h2>
        </div>
      </div>

      {/* Pending Sessions */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200 flex items-center gap-4">
        <div className="bg-yellow-100 p-3 rounded-xl">
          <AlertTriangle size={26} className="text-yellow-700" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Pending Sessions</p>
          <h2 className="text-2xl font-bold text-gray-800">{stats.pending}</h2>
        </div>
      </div>
    
    </div>
  );
}