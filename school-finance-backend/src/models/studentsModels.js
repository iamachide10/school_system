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
    console.log(result);
     
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


export const updateStudentInfoModel=async(studentId,defaultFee)=>{
    try{
        const result = await pool.query("UPDATE students SET  default_fees=$1 WHERE id=$2 RETURNING *",[defaultFee,studentId])
        return  result.rows[0]
    }catch(e){
        console.log("Error occured at Model" ,e);
    }
}