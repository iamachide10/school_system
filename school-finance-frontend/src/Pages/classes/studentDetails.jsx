import { useState,useEffect } from "react";
import { Edit3, User, Layers } from "lucide-react";
import { useParams } from "react-router-dom";




export default function StudentProfile() {
    const [student,setStudent]=useState({})
    const { student_id } = useParams();
    const [loading,setLoading]=useState(false)
    const [open, setOpen] = useState(false);
    const [editName, setEditName] = useState(false);
    const [editFee, setEditFee] = useState(false);
  
    const [name, setName] = useState(student.full_name);
    const [fee, setFee] = useState(student.default_fees);

    useEffect(()=>{
        const fetchStudent=async()=>{
          setLoading(true)
          try{
        const res= await fetch(`http://localhost:5001/api/student/get_student/${student_id}`)
        const data= await res.json()
        if(res.ok){
          console.log(data);
          setStudent(data.result) 
        }
      }catch(e){
        console.log(e);
      }

      setLoading(false)
        }
        fetchStudent()
    },[student_id])




  const handleSave = () => {
    const updated = {
      id: student.id,
      full_name: name,
      default_fees: fee,
    };

    console.log("Saving updated student:", updated);

    setEditName(false);
    setEditFee(false);
  };

   if (loading) return <p className="mt-[6rem]">Loading session...</p>;

  return (
    <div className="w-full max-w-md mx-auto mt-[6rem]">
      <div className="bg-green-100 rounded-2xl shadow-lg p-6 border border-green-200">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <User className="text-green-700" size={32} />
          <h2 className="text-2xl font-bold text-green-800">
            {student.full_name}
          </h2>
        </div>

        {/* Class Info */}
        <div className="bg-white rounded-xl p-4 shadow-inner border border-green-100">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="text-green-600" size={20} />
            <p className="text-green-900 font-medium">
              Class: <span className="font-semibold">{student.class_name}</span>
            </p>
            <p className="text-green-900 font-medium">
              Student Id: <span className="font-semibold">{student_id}</span>
            </p>

          </div>
        </div>

        {/* Edit Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <Edit3 size={18} />
          Edit Student Info
        </button>

        {/* Dropdown */}
        {open && (
          <div className="mt-4 bg-white rounded-xl p-4 shadow-md border border-green-100 space-y-4">

            {/* NAME EDIT */}
            <div>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-green-800">Full Name</p>
                <button
                  onClick={() => setEditName(!editName)}
                  className="text-green-600 text-sm font-semibold"
                >
                  {editName ? "Lock" : "Edit"}
                </button>
              </div>

              {editName ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-2 border border-green-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              ) : (
                <p className="text-green-900 mt-1">{name}</p>
              )}
            </div>

            {/* FEE EDIT */}
            <div>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-green-800">Fee</p>
                <button
                  onClick={() => setEditFee(!editFee)}
                  className="text-green-600 text-sm font-semibold"
                >
                  {editFee ? "Lock" : "Edit"}
                </button>
              </div>

              {editFee ? (
                <select
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  className="w-full mt-2 border border-green-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value={11}>11 cedis</option>
                  <option value={5}>5 cedis</option>
                </select>
              ) : (
                <p className="text-green-900 mt-1">{fee} cedis</p>
              )}
            </div>

            {/* SAVE BUTTON */}
            {(editName || editFee) && (
              <button
                onClick={handleSave}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition"
              >
                Save Changes
              </button>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
