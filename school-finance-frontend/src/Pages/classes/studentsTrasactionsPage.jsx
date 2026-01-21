import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BACKEND_URL from "../../utils/backend";

import { Summary,TransactionsTable, } from "../../components/transactionHelperFunctions";
import FullScreenLoader from "../../components/loader";


export default function StudentTransactionsPage() {
  const { student_code } = useParams();

  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [student_code]);

  async function fetchData() {
    try {
      const studentRes = await fetch(
        `${BACKEND_URL}/api/student/get_student/${student_code}`
      );
      const studentData = await studentRes.json();

    
      const paymentsRes = await fetch(
        `${BACKEND_URL}/api/payment/${student_code}/payments`
      );
      const paymentsData = await paymentsRes.json();

      if (!studentRes.ok || !paymentsRes.ok) {
        alert("Failed to load transaction history");
        return;
      }

      setStudent(studentData);
      setPayments(paymentsData);
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <FullScreenLoader/>
  }

  return (
    <div className="mt-[4rem] max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <p className="text-gray-500">
          {student.result.full_name} ({student.result.student_code})
        </p>
      </div>

      {/* SUMMARY */}
      <Summary student={student} payments={payments} />

      {/* TABLE */}
      <TransactionsTable payments={payments} />
    </div>
  );
}
