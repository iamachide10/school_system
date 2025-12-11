import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import crypto from "crypto"
import bcrypt from "bcryptjs"


dotenv.config()



export const createAccessToken=(data)=>{
    const secrete=process.env.JWT_SECRETE
    const expiresIn=process.env.JWT_EXPIRES_IN
    const token=jwt.sign(data, secrete ,{expiresIn}) 
    return token
}



export function signRefreshToken() {
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const tokenHash = bcrypt.hashSync(refreshToken );
  const tokenPrefix = refreshToken.slice(0,10)
  
  return  { refreshToken, tokenHash,tokenPrefix }; 
}


export const generateVerificationToken=()=>{
    const token= crypto.randomBytes(20).toString("hex")
    const expressAt= new Date (Date.now() + 30*60*1000) 

    return {token, expressAt}   
}