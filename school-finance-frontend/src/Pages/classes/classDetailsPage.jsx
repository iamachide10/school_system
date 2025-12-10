import { useParams, useNavigate } from "react-router-dom";
import { useEffect ,useState} from "react";
import { useAuth } from "../../context/authContext";
import { apiFetch } from "../../utils/apiFetch";
import FullScreenLoader from "../../components/loader";

export default function ClassDetails() {
  const [message,setMessage]=useState("")
  const {userId}=useAuth()
  const [loading,setLoading]=useState(false)

  const { id } = useParams();
  const navigate = useNavigate();

   useEffect(() => {
    const getClassStudents=async()=>{
      setLoading(true)
  try{
        const res= await apiFetch(`/student/get_class_students/${id}` ,
          { 
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
          }
        )
        const data= await res.json()
        if(!res.ok){
          setMessage(data.message)
        }
      }catch(e){
        console.log(e);
      }  
      setLoading(false)
      }
      getClassStudents()
  }, [id]);
  if(loading) return <FullScreenLoader/>
  if(message){
    return     <h1 className="mt-[9rem] w-full text-center text-3xl font-bold text-red-700 ">{message}</h1>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <h1 className="text-4xl font-bold text-green-700 text-center mb-10">
        Class Options
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Students in Class */}
        <div
          onClick={() => navigate(`/classes/students/${id}`)}
          className="cursor-pointer bg-white p-8 rounded-xl shadow hover:shadow-lg 
                     transition border border-green-100 hover:border-green-300"
        >
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Students in this Class
          </h2>
          <p className="text-gray-600">
            View all students registered in this class.
          </p>
        </div>

        {/* Start Session */}
        <div
          onClick={() => navigate(`/classes/sessions/${id}/${userId}`)}
          className="cursor-pointer bg-white p-8 rounded-xl shadow hover:shadow-lg 
                     transition border border-green-100 hover:border-green-300"
        >
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Start Session
          </h2>
          <p className="text-gray-600">
            Begin a new session and take student activity or financial records.
          </p>
        </div>
      </div>
    </div>
  );
}


