
import pool from "../config/db.js"
import bcrypt from "bcryptjs"



export const createUser= async(password,email,role,name)=>{
    try{
        const salt=await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , salt)

        const result = await pool.query(
            `INSERT INTO users (name,email,password,role)
            VALUES($1 ,$2 ,$3 ,$4)  RETURNING * 
            ` ,[name,email ,hashedPassword, role])
            return result.rows[0]
        }catch(e){
            console.log("Failed :",e);
            throw e
        }
}  


export const getUser=async(email)=>{
    try{
        const result =await pool.query("SELECT * FROM users WHERE email=$1" ,[email])
        if(result.rows.length===0){
            return null 
        }
        return result.rows[0]

    }catch(e){
        console.log("Error occured checking user ", e);
        throw e
    }
}


export const getAllUsersModel=async ()=>{
try{
    const result = await pool.query("SELECT * FROM users")
    return result.rows
}catch(e){
    console.log(e);
    }
}
