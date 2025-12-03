import pool from "../config/db.js";

export const saveRefreshToken= async (userId, refreshToken,tokenPrefix,userRole)=>{
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
    try{
        const result= await pool.query("INSERT INTO refresh_tokens (user_id, token_hash, expires_at,token_prefix,user_role,replaced_by)   VALUES ($1, $2, $3, $4, $5,NULL)\
            RETURNING *", [userId, refreshToken, expiresAt,tokenPrefix,userRole])
            console.log("Refresh token saved:", result.rows[0]);
        return result.rows[0];
    }catch(e){
        console.log("Error saving refresh token", e);
        throw e
    }
}
 

export const getRefreshToken= async (token_prefix)=>{
    try{
        const result= await pool.query("SELECT * FROM refresh_tokens WHERE token_prefix = $1 AND expires_at > NOW()" ,[token_prefix])
        if(result.rows.length===0){
            return null
        }
        return result.rows[0]
    }catch(e){
        console.log("Error getting refresh token", e);
        throw e
    }
}


export const editTokenStatus=async(newTokenId,oldTokenId)=>{
    await pool.query(
      "UPDATE refresh_tokens SET replaced_by = $1 WHERE id = $2",
      [newTokenId, oldTokenId]
    );
}


export const deleteRefreshToken=async(id)=>{
    await pool.query("DELETE FROM refresh_tokens WHERE id=$1",[id])
}