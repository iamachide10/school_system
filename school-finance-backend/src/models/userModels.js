
import pool from "../config/db.js"
import bcrypt from "bcryptjs"


export const createUser= async(password,email,role,name,verify_expiry,verification_token)=>{
    try{
        const salt=await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password , salt)

        const result = await pool.query(
            `INSERT INTO users (name,email,password,role ,verify_expiry,verification_token)
            VALUES($1 ,$2 ,$3 ,$4,$5,$6)  RETURNING * 
            ` ,[name,email ,hashedPassword, role ,verify_expiry,verification_token ])
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


export const saveResetToken=async(token,tokenExpiry,userId)=>{
    try{
        const result = await pool.query("UPDATE users SET verification_token=$1 ,verify_expiry=$2 WHERE id=$3 RETURNING *",[token,tokenExpiry,userId])
        return result.rows[0]
    }catch(e){
        console.log("Server Error" ,e);
        
    }

}

export const changePasswordModel=async(userId,password)=>{
    const salt=await bcrypt.genSalt(10)
    const hashedPassword= await bcrypt.hash(password , salt)
    try{
        const result = await pool.query("UPDATE users SET password= $1 WHERE id=$2 RETURNING *",[hashedPassword,userId])
        return result.rows[0]

    }catch(e){
        console.log(e);
        

    }
}


