import pool from "../config/db.js";

export async function createPaymentModel({ student_id, amount, payment_method }) {
    try{
        const res = await pool.query(
          `INSERT INTO student_fees_payments (student_id, amount, payment_method)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [student_id, amount, payment_method]
        );
        console.log(res);
        
      
        return res.rows[0];
    }catch(e){
        console.log("Error occured createPaymentModel" , e);
        
    }
}

export async function getPaymentsByStudent(student_id) {
  const res = await pool.query(
    `SELECT id, amount, payment_date, payment_method
     FROM student_fees_payments
     WHERE student_id = $1
     ORDER BY payment_date DESC`,
    [student_id]
  );

  return res.rows;
}


