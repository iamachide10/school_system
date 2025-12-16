import pool from "../config/db.js"


export const createClass=async(name,  classNumber)=>{
    try{
        const result = await pool.query("INSERT INTO classes (name,class_number)  VALUES($1,$2) RETURNING *",[name,  classNumber])
        return result.rows[0]
    }catch(e){
        console.log(e);
    }
}



export const getAllClassesModel=async()=>{
    try{
        const result =await pool.query("SELECT * FROM classes ORDER BY class_number ASC")
        return result.rows
        
    }catch(e){
        console.log(e);
    }
}


export const getClassById=async(id)=>{
    try{
        const res=await pool.query("SELECT * FROM classes WHERE id=$1" ,[id])
        return res.rows[0];
    }catch(e){
        console.log("An error occured getting class",e);
        
    }
}


export const updateTeacherStatus=async(class_id,teacher_name,teacher_id)=>{
    try{
        await pool.query("UPDATE classes SET teacher_name=$1 ,teacher_id=$2 WHERE id=$3" ,[teacher_name,teacher_id,class_id])
        console.log("Worked Well!!!");
        
    }catch(e){
        console.log("An error occured, ",e);
        
    }
}