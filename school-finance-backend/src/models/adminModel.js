import pool from "../config/db.js";

export const getTotalCollectedToday = async () => {
  const query = `
    SELECT COALESCE(SUM(sr.fee_amount), 0) AS total
    FROM session_records sr
    JOIN session s ON sr.session_id = s.id
    WHERE sr.has_paid = true AND DATE(s.time) = CURRENT_DATE;
  `;
  const { rows } = await pool.query(query);
  return rows[0].total;
};


export const getTotalCollectedThisMonth = async () => {
  const query = `
    SELECT COALESCE(SUM(sr.fee_amount), 0) AS total
    FROM session_records sr
    JOIN session s ON sr.session_id = s.id
    WHERE sr.has_paid = true
      AND DATE_TRUNC('month', s.time) = DATE_TRUNC('month', CURRENT_DATE);
  `;
  const { rows } = await pool.query(query);
  return rows[0].total;
};



export const getPendingSessionsCount = async () => {
  const query = `
    SELECT COUNT(*) AS count
    FROM session
    WHERE finished = true
    AND confirmed = false;
  `;
  const { rows } = await pool.query(query);
  return rows[0].count;
};





export const getUnpaidStudentsCount = async () => {
  const query = `
    SELECT COUNT(*) AS count
    FROM students st
    LEFT JOIN (
      SELECT student_id, SUM(fee_amount) AS paid
      FROM session_records
      WHERE has_paid = false
      GROUP BY student_id
    ) sr ON sr.student_id = st.id
    WHERE sr.paid IS NULL OR sr.paid < st.default_fees;
  `;
  const { rows } = await pool.query(query);
  return rows[0].count;
};
