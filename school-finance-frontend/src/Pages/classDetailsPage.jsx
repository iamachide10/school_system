import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { StudentCard } from "../components/studentCard";


export default function ClassDetails() {
  const { id } = useParams();
  const [students, setStudents] = useState([]);

  // 📌 TEMP TEST DATA
  const testStudents = [
    { _id: "s1", name: "Boss Kyei", studentId: "6001" },
    { _id: "s2", name: "Ama Boateng", studentId: "6002" },
    { _id: "s3", name: "Kofi Mensah", studentId: "6003" },
  ];

  useEffect(() => {
    const getClassStudents=async()=>{
      try{
        const res= await fetch(`http://localhost:5001/api/student/get_class_students/${id}`)
        const data= await res.json()
        if(res.ok){
          console.log(data.result); 
          setStudents(data.result)
        }
      }catch(e){
        console.log(e);
      }    //setStudents(testStudents); 
      }
      getClassStudents()
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-8">
        Students in This Class
      </h1>

      {students.length === 0 && (
        <p className="text-gray-500">No students in this class yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
          <StudentCard key={student.student_code} student={student} />
        ))}
      </div>
    </div>
  );
}
