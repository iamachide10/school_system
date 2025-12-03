import pool from "../config/db.js"


export const getVerificationToken=async(token)=>{
    const result = await pool.query("SELECT * FROM users WHERE verification_token=$1 AND verify_expiry>NOW()",[token])
    if(result.rows.length===0){
        return null
    }
    return result.rows[0]
} 

export const verifyUserEmail=async(userId)=>{
    const result = await pool.query("UPDATE users SET verified=true, verification_token=NULL, verify_expiry=NULL WHERE id=$1 RETURNING *",[userId])
    return result.rows[0]
}