
import pool from "../config/db.js"
import bcrypt from "bcryptjs"



export const createUser= async(password,email,role,name)=>{
    try{
        const salt=await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password , salt)

        const result = await pool.query(
            `INSERT INTO users (name,email,password,role)
            VALUES($1 ,$2 ,$3 ,$4) 
            ` ,[name,email ,hashedPassword, role])

            return result.rows[0]
        }catch(e){
            console.log("Failed :",e);
            throw e
        }


}  



