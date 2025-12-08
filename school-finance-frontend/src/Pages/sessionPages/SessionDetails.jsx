import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SessionDetails() {
  const { session_id } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  
  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/session/${session_id}/records`);
        const data = await res.json();
        if (res.ok) setStudents(data.result || data); // adapt to your backend
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [session_id]);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const res = await fetch(`http://localhost:5001/api/session/${session_id}/confirm`)
      if (res.ok) {
        alert("Session confirmed!");
        window.location.href="/accountant-dashboard"
        }
    } catch (err) {
      console.error(err);
    } finally {
      setConfirming(false);
    }
  };

  const paidStudents = students.filter(s => s.has_paid);
  const unpaidStudents = students.filter(s => !s.has_paid);
  const totalPaid = paidStudents.reduce((acc, s) => acc + Number(s.fee_amount), 0);
  const totalUnpaid = unpaidStudents.reduce((acc, s) => acc + Number(s.fee_amount), 0);

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className=" text-2xl font-bold text-green-700 mb-6">Session Details</h1>

      {/* Paid Students */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-2">Paid Students (Total: GH₵ {totalPaid})</h2>
        <div className="space-y-2">
          {paidStudents.map(s => (
            <div key={s.student_id} className="p-3 bg-green-100 rounded-lg flex justify-between">
              <div>
                <p className="font-semibold">{s.full_name}</p>
                <p className="text-gray-700 text-sm">Index: {s.student_code}</p>
              </div>
              <span className="font-bold text-green-800">GH₵ {s.fee_amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Unpaid Students */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Unpaid Students (Total: GH₵ {totalUnpaid})</h2>
        <div className="space-y-2">
          {unpaidStudents.map(s => (
            <div key={s.student_id} className="p-3 bg-red-100 rounded-lg flex justify-between">
              <div>
                <p className="font-semibold">{s.full_name}</p>
                <p className="text-gray-700 text-sm">Index: {s.student_code}</p>
              </div>
              <span className="font-bold text-red-700">GH₵ {s.fee_amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={confirming}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition"
      >
        {confirming ? "Confirming..." : "Confirm Session"}
      </button>
    </div>
  );
}
