import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export const SessionPage = () => {
  const { class_id, teacher_id } = useParams();
  const [search, setSearch] = useState("");

  const [sessionId, setSessionId] = useState(null);
  const [closingCode, setClosingCode] = useState("");
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
   const {token}=useAuth()


const filteredStudents = students.filter((s) =>
  s.full_name.toLowerCase().includes(search.toLowerCase()) ||
  s.student_code.toLowerCase().includes(search.toLowerCase())
);

   

 useEffect(() => {
  if (!token) return;

  const createSession = async () => {
    const url = "https://school-system-backend-78p1.onrender.com/api/session/start_session";
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
        console.log("SESSION RESPONSE:", data);
        // Always set sessionId + code
        setSessionId(data.session.id);
        setClosingCode(data.session.session_code);
        // If it's an existing session → load saved records
        if (data.status === "existing") {
          setShouldRefresh(true); 
        } 
        // If it's a new session → load class list
        else {
          console.log("New session created, loading class students.");
          await loadStudents();
           handleSubmit(); // Pre-submit to create empty records
        }
      }
    } catch (e) {
      console.log("createSession error:", e);
    }
  };

  createSession();
}, [class_id, teacher_id, token]);


  
  const loadStudents = async() => {
      setLoading(true);
      try{
          const res= await fetch(`https://school-system-backend-78p1.onrender.com/api/student/get_class_students/${class_id}` ,
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

  const url = "https://school-system-backend-78p1.onrender.com/api/session/submit_session";
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
        const res = await fetch(`https://school-system-backend-78p1.onrender.com/api/session/${sessionId}/records`);
        const data = await res.json();
        console.log("Data received",data);
        
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
  }, [ shouldRefresh]);
  
  


  // FINISH SESSION (temporary empty logic)
const handleFinishSession =async () => {
    const sessionCode = prompt(`Enter session closing code: ${closingCode}`)
    const url = "https://school-system-backend-78p1.onrender.com/api/session/finish_session";
    
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

    const totalStudents = students.length;
    const studentsPaid = students.filter(s => s.has_paid).length;
    const studentsLeftToPay = students.filter(s => !s.has_paid).length;
    const amountReceived = students.filter(s => s.has_paid).reduce((sum,s)=> sum + Number(s.default_fees) ,0)
    console.log(amountReceived);
    


  if (loading) return <p className="mt-[6rem]">Loading session...</p>;

  return (
    <div className= "mt-[4rem] p-6">
      <p className="text-green-600 font-semibold mb-3">
        Session Code: {closingCode}
      </p>



    <div className="flex flex-wrap gap-4 p-4">
      {/* Total Students */}
      <div className="flex-1 min-w-[150px] bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <p className="text-xs text-gray-500">Total Students</p>
        <h2 className="text-xl font-bold text-gray-800">{totalStudents}</h2>
      </div>

      {/* Students Paid */}
      <div className="flex-1 min-w-[150px] bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
        <p className="text-xs text-green-600">Paid</p>
        <h2 className="text-xl font-bold text-green-700">{studentsPaid}</h2>
      </div>

      {/* Students Left to Pay */}
      <div className="flex-1 min-w-[150px] bg-red-50 border border-red-200 rounded-lg p-3 shadow-sm">
        <p className="text-xs text-red-600">Left to Pay</p>
        <h2 className="text-xl font-bold text-red-700">{studentsLeftToPay}</h2>
      </div>

      {/* Amount Received */}
      <div className="flex-1 min-w-[150px] bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-sm">
        <p className="text-xs text-yellow-600">Amount Received</p>
        <h2 className="text-xl font-bold text-yellow-700">
        ?  GH₵ {Number(amountReceived).toFixed(2)}
        </h2>
      </div>
    </div>

    <input
  type="text"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Search student by name or index..."
  className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
    />


   <form className="space-y-4">
  {filteredStudents.map((student) => (
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
