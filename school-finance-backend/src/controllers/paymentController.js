import { createPaymentModel, getPaymentsByStudent } from "../models/paymentModel.js";
import { getStudentWithFeesModel } from "../models/studentsModels.js";
import sendSMS from "../Utils/sendSms.js";






function normalizePhoneNumber(phone) {

  let cleaned = phone.replace(/\s+/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "233" + cleaned.slice(1);
  }
  if (cleaned.startsWith("233")) {
    return cleaned;
  }
  return null; 
}

export async function createPaymentController(req, res) {
  try {
    const { student_id, amount } = req.body;

    if (!student_id || !amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }


    const studentData = await getStudentWithFeesModel(student_id);

    if (!studentData) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { student, fees } = studentData;

  
    if (!student.phone) {
      return res.status(400).json({
        message: "Parent phone number not found. Please add a phone number before making payment."
      });
    }

    // 4️⃣ Normalize phone number
    const parentPhone = normalizePhoneNumber(student.phone);

    if (!parentPhone) {
      return res.status(400).json({
        message: "Invalid parent phone number format."
      });
    }

    // 5️⃣ Prevent overpayment
    if (Number(amount) > fees.balance) {
      return res.status(400).json({
        message: `Payment exceeds balance. Current balance: ${fees.balance.toFixed(2)}`
      });
    }

    // 6️⃣ Create payment
    const payment = await createPaymentModel({
      student_id,
      amount,
      payment_method: "cash"
    });

    const remainingBalance = fees.balance - Number(amount);

    // 7️⃣ Send SMS (non-blocking)
    sendSMS({
      parentContact: parentPhone,
      studentName: student.full_name,
      studentCode: student.student_code,
      amount,
      balance: remainingBalance
    });

    // 8️⃣ Receipt
    const receipt = {
      student_name: student.full_name,
      student_code: student.student_code,
      amount_paid: Number(amount),
      remaining_balance: remainingBalance
    };

    return res.status(201).json({
      payment,
      receipt
    });

  } catch (err) {
    console.error("Error in createPaymentController:", err);
    return res.status(500).json({ message: "Server error" });
  }
}



export async function fetchPayments(req, res) {
  
  try {    
    const payments = await getPaymentsByStudent(req.params.student_id);
    console.log("Payment" , payments);
    
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
