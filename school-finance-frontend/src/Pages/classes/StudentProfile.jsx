
import { StudentProfileHeader } from "../../components/Student Profile/StudentProfileHeader";
import { StudentActions } from "../../components/Student Profile/StudentActions";
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { adaptStudentFromApi } from "../../components/Student Profile/studentAdapter";
import BACKEND_URL from "../../utils/backend";
import FullScreenLoader from "../../components/loader";

export default function StudentProfile() {
const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { student_id } = useParams();

  useEffect(() => {  
    async function fetchStudent() {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/student/get_student/${student_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch student");
        }
        const data = await response.json();
        const adaptedStudent = adaptStudentFromApi(data);
        setStudent(adaptedStudent);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [student_id]);


  if (loading) return <FullScreenLoader/>
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!student) return null;

  return (
    <div className="min-h-screen bg-white">
      <StudentProfileHeader student={student} />
      <StudentActions student={student} />
    </div>
  );
}
