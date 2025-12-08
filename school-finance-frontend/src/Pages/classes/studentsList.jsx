import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {StudentCard} from "../../components/studentCard"
import { useAuth } from "../../context/authContext";


export default function StudentsList() {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [message,setMessage]=useState("")
    const [search, setSearch] = useState("");



  const filteredStudents = students.filter((s) =>
  s.full_name.toLowerCase().includes(search.toLowerCase()) ||
  s.student_code.toLowerCase().includes(search.toLowerCase())
);

   

  const {token}=useAuth()

  useEffect(() => {
    const getClassStudents=async()=>{
      console.log(token);
      
      try{
        const res= await fetch(`http://localhost:5001/api/student/get_class_students/${id}` ,
          { 
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization" :`Bearer ${token}`
            },
          }
        )
        const data= await res.json()
        if(res.ok){
          console.log(data.result); 
          setStudents(data.result)
        }
        if(!res.ok){
          setMessage(data.message)
        }
      }catch(e){
        console.log(e);
      }    //setStudents(testStudents); 
      }
      getClassStudents()
  }, [id]);

  return (
    <div className="mt-[4rem] min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-8">
        Students in This Class
      </h1>
      <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search student by name or index..."
      className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
    />


      {message && <h1 className="text-3xl font-bold text-red-700 mb-8">{message}</h1>}
      {students.length === 0 && (
        <p className="text-gray-500">No students in this class yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
          <StudentCard key={student.student_code} student={student} />
        ))}
      </div>
    </div>
  );
}
