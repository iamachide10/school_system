import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adaptStudentFromApi } from "../../components/Student Profile/studentAdapter";
import BACKEND_URL from "../../utils/backend"
import FullScreenLoader from "../../components/loader";

export default function PaySchoolFees() {
  const { student_id } = useParams();
  
  
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [feesSummary, setFeesSummary] = useState(null);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function fetchData() {
        setLoading(true)
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/student/get_student_with_fees/${student_id}`
        );

        if (!res.ok) throw new Error("Failed to load student");

        const data = await res.json();

        setStudent(adaptStudentFromApi({result :data.student}));

        
        setFeesSummary(data.fees);
      } catch (err) {
        console.log(err);
        
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [student_id]);

 

async function handleSubmit(e) {
  e.preventDefault();

  if (!amount || Number(amount) <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  try {
    setSubmitting(true);

    const res = await fetch(`${BACKEND_URL}/api/payment/pay_fees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id,
        amount: Number(amount),
        payment_method: method,
        notes,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Show backend error
      alert(data.message || "Payment failed");
      return;
    }

    // ✅ Payment succeeded, show receipt
    const { receipt } = data;
    alert(
      `Payment Successful!\n\n` +
      `Student: ${receipt.student_name} (${receipt.student_code})\n` +
      `Amount Paid: GHS ${receipt.amount_paid.toFixed(2)}\n` +
      `Remaining Balance: GHS ${receipt.remaining_balance.toFixed(2)}`
    );

    // ✅ Navigate to profile and replace payment page
    window.location.replace(`/students/profile/${student_id}`);

  } catch (err) {
    console.error(err);
    alert("Server error. Payment failed.");
  } finally {
    setSubmitting(false);
  }
}

  // ==========================
  // STATES
  // ==========================
  if (loading) return <FullScreenLoader/>
  if (error) return <p className="mt-10 p-6 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      {/* HEADER */}
      <div className="mt-10 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-green-700 font-medium"
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold">Pay School Fees</h1>
      </div>

      {/* STUDENT SUMMARY */}
      <div className="border rounded-xl p-4">
        <p className="font-semibold">{student.personal.full_name}</p>
        <p className="text-sm text-gray-500">
          Index Number: {student.personal.index_number}
        </p>
      </div>

      {/* FEES SUMMARY */}
      <div className="border rounded-xl p-4 space-y-2">
        <div className="flex justify-between">
          <span>Required Fees</span>
          <span>{feesSummary.required} GHS</span>
        </div>
        <div className="flex justify-between">
          <span>Total Paid</span>
          <span>{feesSummary.paid} GHS</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Balance</span>
          <span className="text-green-700">
            {feesSummary.balance} GHS
          </span>
        </div>
      </div>

      {/* PAYMENT FORM */}
      <form
        onSubmit={handleSubmit}
        className="border rounded-xl p-4 space-y-4"
      >
        <div>
          <label className="text-sm text-gray-500">Amount (GHS)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        {/* <div>
          <label className="text-sm text-gray-500">Payment Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select method</option>
            <option value="cash">Cash</option>
            <option value="momo">Mobile Money</option>
            <option value="bank">Bank</option>
          </select>
        </div> */}

        <button
          disabled={submitting}
          className="w-full bg-green-700 text-white py-3 rounded-md font-medium disabled:opacity-50"
        >
          {submitting ? "Recording..." : "Record Payment"}
        </button>
      </form>
    </div>
  );
}
