import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export const SessionPage = () => {
  const { class_id, teacher_id } = useParams();

  const [sessionId, setSessionId] = useState(null);
  const [closingCode, setClosingCode] = useState("");
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
   const {token}=useAuth()
   

  useEffect(() => {
      if (!token) return;
    const createSession = async () => {
      const url = "http://localhost:5001/api/session/start_session";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ class_id, teacher_id }),
      };

      try {
        const res = await fetch(url, options);
        const data = await res.json();

        if (res.ok) {
          console.log(data);
          setSessionId(data.session.id)
          setClosingCode(data.session.session_code)
          await loadStudents();
        }
      } catch (e) {
        console.log(e);
      }
    };
    createSession();
  }, [class_id, teacher_id,token]);



  
  const loadStudents = async() => {
      setLoading(true);
      try{
          const res= await fetch(`http://localhost:5001/api/student/get_class_students/${class_id}` ,
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
            setStudents(data.result)
          }
        }catch(e){
          console.log(e);
        } 
        setLoading(false);
  };


  // HANDLE TICKING (TOGGLE PAID)
const togglePaid = (id) => {
  setStudents(prev =>
    prev.map(s =>
      s.id === id
        ? { ...s, has_paid: !Boolean(s.has_paid) }
        : s
    )
  );
};

  // SUBMIT FEES (temporary empty logic)
const handleSubmit = async () => {
  if (!sessionId) return alert("Session ID missing");
  if (loading) return;   // Prevent double-click
  setLoading(true);
  // Convert students safely
  const cleanedStudents = students.map(s => ({
    student_id: Number(s.id),
    has_paid: Boolean(s.has_paid),
    default_fees: Number(s.default_fees)
  }));

  const url = "http://localhost:5001/api/session/submit_session";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      students: cleanedStudents
    }),
  };

  try {
    const result = await fetch(url, options);
    const data = await result.json();

    if (result.ok) {
      console.log("Submit successful:", data);
      setShouldRefresh(true);
    }
  } catch (e) {
    console.error("Submit error:", e);
  }

  setLoading(false);
};



useEffect(() => {
  if (!sessionId) return;

  const fetchSessionRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/session/${sessionId}/records`);
      const data = await res.json();

      if (!data || data.length === 0) {
        setLoading(false);
        return;
      }

      setStudents(data.map(r => ({
        id: Number(r.student_id),
        full_name: r.full_name,
        student_code: r.student_code,
        default_fees: Number(r.default_fees ?? r.fee_amount),
        has_paid: Boolean(r.has_paid)
      })));

    } catch (err) {
      console.error("fetchSessionRecords error:", err);
    }
    setLoading(false);
    setShouldRefresh(false); // RESET
  };

  fetchSessionRecords();
}, [sessionId, shouldRefresh]);





  // FINISH SESSION (temporary empty logic)
const handleFinishSession =async () => {
    const sessionCode = prompt(`Enter session closing code: ${closingCode}`)
    const url = "http://localhost:5001/api/session/finish_session";
    
    const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      sessionCode
    }),
  };
  try{
    const res= await fetch(url,options)
    if(res.ok){
         window.location.href="/classes"
    }
  }catch(e){
    console.log(e); 
  }
  };



  if (loading) return <p className="mt-[6rem]">Loading session...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Fee Collection Session — Class {class_id}
      </h2>

      <p className="text-green-600 font-semibold mb-3">
        Session Code: {closingCode}
      </p>

      <form className="space-y-4">
        {students.map((student) => (
          <div
            key={student.id}
            className="border p-4 rounded-lg shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{student.full_name}</p>
              <p className="text-gray-600">Index: {student.student_code}</p>
              <p className="text-gray-800">Fee: {student.default_fees} cedis</p>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!student.has_paid}
              
                onChange={() => togglePaid(student.id)}
              />
              <span>Paid</span>
            </label>
          </div>
        ))}
      </form>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white py-2 px-4 rounded-lg"
        >
          Submit
        </button>

        <button
          onClick={handleFinishSession}
          className="bg-red-600 text-white py-2 px-4 rounded-lg"
        >
          Finish Session
        </button>
      </div>
    </div>
  );
};
