import { StudentProfileHeader } from "../../components/Student Profile/StudentProfileHeader";
import { StudentActions } from "../../components/Student Profile/StudentActions";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adaptStudentFromApi } from "../../components/Student Profile/studentAdapter";
import BACKEND_URL from "../../utils/backend";
import FullScreenLoader from "../../components/loader";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { student_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStudent() {
      try {
        const response = await fetch(`${BACKEND_URL}/api/student/get_student/${student_id}`);
        if (!response.ok) throw new Error("Failed to fetch student");
        const data = await response.json();
        setStudent(adaptStudentFromApi(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [student_id]);

  if (loading) return <FullScreenLoader />;

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-bold text-text">{error}</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-primary font-semibold hover:underline text-sm"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="min-h-screen bg-background">
      <StudentProfileHeader student={student} />
      <StudentActions student={student} />
    </div>
  );
}
