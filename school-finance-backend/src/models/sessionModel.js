import pool from "../config/db.js"


export const startSessionModel=async(teacher_id,class_id,session_code)=>{
    try {

        const result = await pool.query("INSERT INTO session(teacher_id, class_id ,session_code,finished) VALUES($1 ,$2 , $3 ,false) RETURNING *" ,[teacher_id, class_id ,session_code] )
        
        return result.rows[0]
    }catch(e){
        console.log(e);
        
    }
}

export const checkActiveSessionModel = async (class_id) => {
    const query = `
        SELECT * FROM session
        WHERE class_id = $1 AND finished = false
    `;
    const values = [class_id];
    const result = await pool.query(query, values);
    return result.rows[0];
};



export const submitSessionModel = async (student, session_id) => {

  try {
    const query = `
      INSERT INTO session_records (session_id, student_id, has_paid, fee_amount)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (session_id, student_id)
      DO UPDATE SET
        has_paid = EXCLUDED.has_paid,
        fee_amount = EXCLUDED.fee_amount
      RETURNING *;
    `;

    const values = [
      session_id,
      student.student_id,
      student.has_paid,
      student.default_fees
    ];

    const result = await pool.query(query, values);
    return result.rows;

  } catch (error) {
    console.log("An Error ocurred",error);
  }
};


export const getRecordsByIdModel = async (sessionId) => {
  try {
    const query = `
      SELECT  
        sr.student_id,
        sr.has_paid,
        sr.fee_amount,
        s.full_name,
        s.student_code,
        s.default_fees
      FROM session_records sr
      INNER JOIN students s
        ON sr.student_id = s.id
      WHERE sr.session_id = $1
      ORDER BY s.id ASC;
    `;
    const { rows } = await pool.query(query, [sessionId]);
    return rows;
        
  } catch (error) {
    console.log("getRecordsByIdModel error:", error);
    return [];
  }
};


export const finishSessionModel=async (session_id)=>{
try{
    const result = await pool.query("UPDATE session SET finished = $1 WHERE id = $2", [true,session_id])
 }catch(e){
    console.log(e);
 }
}

export const getAllSessionModel=async()=>{
    const result = await pool.query("SELECT * FROM session")
    return result.rows
}

export const getSessionById=async (id)=>{
try{
    const result = await pool.query("SELECT session_code FROM session WHERE id = $1",[id])
    return result.rows[0].session_code
    }catch(e){
        console.log(e);
    }
}


export const getAllPendingSessionsModel=async()=>{
  const query = `
    SELECT 
    s.id AS session_id,
    s.class_id,
    c.name,
    s.time, 
    (SELECT SUM(fee_amount) FROM session_records WHERE session_id=s.id AND 
    has_paid=true

    )AS total_amount,
    (SELECT COUNT(*) FROM session_records WHERE session_id = s.id AND has_paid=true
    )AS paid_count
    FROM session s 
    INNER JOIN classes c ON  c.id=s.class_id
    WHERE s.finished = true AND confirmed= false
    ORDER BY s.time DESC;
  ` ;
try{
  const {rows} = await pool.query(query)
  return rows
}catch(e){
  console.log(e);
}
}


export const confirmSessionsModel= async (sessionId)=>{
try{
  const result =await pool.query("UPDATE session SET confirmed = true WHERE id = $1 RETURNING *",[sessionId])
  return result.rows[0]
}catch(e){
  console.log(e);  
}
}