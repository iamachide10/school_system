import { useParams, useNavigate } from "react-router-dom";
import { useEffect ,useState} from "react";
import { useAuth } from "../../context/authContext";

export default function ClassDetails() {
  const [message,setMessage]=useState("")
   const {token,userId}=useAuth()

  const { id } = useParams();
  const navigate = useNavigate();

   useEffect(() => {
    const getClassStudents=async()=>{
      
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
        if(!res.ok){
          setMessage(data.message)
        }
      }catch(e){
        console.log(e);
      }  
      }
      getClassStudents()
  }, [id]);
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






// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {StudentCard} from "../../components/studentCard"
// import { useAuth } from "../../context/authContext";


// export default function ClassDetails() {
//   const { id } = useParams();
//   const [students, setStudents] = useState([]);
//   const [message,setMessage]=useState("")



//   const {token}=useAuth()

//   useEffect(() => {
//     const getClassStudents=async()=>{
//       console.log(token);
      
//       try{
//         const res= await fetch(`http://localhost:5001/api/student/get_class_students/${id}` ,
//           { 
//             method:"POST",
//             headers:{
//                 "Content-Type":"application/json",
//                 "Authorization" :`Bearer ${token}`
//             },
//           }
//         )
//         const data= await res.json()
//         if(res.ok){
//           console.log(data.result); 
//           setStudents(data.result)
//         }
//         if(!res.ok){
//           setMessage(data.message)
//         }
//       }catch(e){
//         console.log(e);
//       }    //setStudents(testStudents); 
//       }
//       getClassStudents()
//   }, [id]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
//       <h1 className="text-3xl font-bold text-green-700 mb-8">
//         Students in This Class
//       </h1>

//       {message && <h1 className="text-3xl font-bold text-red-700 mb-8">{message}</h1>}
//       {students.length === 0 && (
//         <p className="text-gray-500">No students in this class yet.</p>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {students.map((student) => (
//           <StudentCard key={student.student_code} student={student} />
//         ))}
//       </div>
//     </div>
//   );
// }
