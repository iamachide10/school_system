import pool from "../config/db.js"


const createStudentModel=async(full_name,student_code,default_fees,class_id,sequence)=>{
try{
    const result = await pool.query("INSERT INTO students (full_name,student_code,default_fees,class_id,sequence)\
         VALUES($1,$2,$3,$4,$5) RETURNING *", [full_name,student_code,default_fees,class_id,sequence])
         return result.rows[0]
}catch(e){
    console.log(e);
    }
}

export default createStudentModel

export const getStudentsModel=async(class_id)=>{
try{
    const result = await pool.query("SELECT * FROM students WHERE class_id = $1",[class_id])
    return result.rows
}catch(e){
    console.log(e);
    }
}

export const getAllStudents=async()=>{
    const result =await pool.query("SELECT * FROM students" ) 
    return result.rows

}

export const getHeighestSeq=async(id)=>{
    const result =await pool.query("SELECT MAX(sequence) AS lastSeq FROM students WHERE class_id=$1 " ,[id])   
     
    console.log((parseInt(result.rows[0].lastseq) ||0));
    return (parseInt(result.rows[0].lastseq)||0) + 1    
    
}





export const getClassStudentsModel=async (id)=>{
   try{
       const result =await pool.query("SELECT * FROM students WHERE class_id = $1  ORDER BY id ASC",[id])
       return result.rows

   }catch(e){
       console.log(e)
   } 
}


export const getStudentByIdModel=async(studentId)=>{
    try{
        const result = await pool.query("SELECT * FROM students WHERE student_code = $1" ,[studentId])
        return result.rows[0]
    }catch(e){
        console.log(e);
    }
}






export async function getStudentWithFeesModel(id) {
    try{

      const res = await pool.query(
        `SELECT 
            s.id, s.student_code, s.full_name, s.default_fees, s.required_fees, s.class_id, s.sequence, s.phone,
            COALESCE(SUM(p.amount),0) as total_paid
        FROM students s
        LEFT JOIN student_fees_payments p ON p.student_id::text = s.student_code
        WHERE s.student_code = $1
        GROUP BY s.id`,
        [id]
        );

      
        const student = res.rows[0];
        
        if (!student) return null;
      
        const feesSummary = {
          required: Number(student.required_fees),
          paid: Number(student.total_paid),
          balance: Number(student.required_fees) - Number(student.total_paid),
        };
      
        return { student, fees: feesSummary };
    }catch(e){
        console.log("Error at getStudentWithFeesModel" ,e);
        
    }
}


export async function updateStudentModel(studentCode, fields) {
  const updates = [];
  const values = [];
  let index = 1;

  if (fields.full_name !== undefined) {
    updates.push(`full_name = $${index++}`);
    values.push(fields.full_name);
  }

  if (fields.default_fees !== undefined) {
    updates.push(`default_fees = $${index++}`);
    values.push(fields.default_fees);
  }

  if (fields.phone !== undefined) {
    updates.push(`phone = $${index++}`);
    values.push(fields.phone);
  }

  if (updates.length === 0) return null;

  values.push(studentCode);

  const query = `
    UPDATE students
    SET ${updates.join(", ")}
    WHERE student_code = $${index}
    RETURNING *;
  `;
  console.log(query);
  
  console.log(values);
  

  const result = await pool.query(query, values);
  console.log(result.rows);
  
  return result.rows[0];
}
