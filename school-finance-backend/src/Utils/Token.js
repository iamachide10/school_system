import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()



export const createToken=(data)=>{
    const secrete=process.env.JWT_SECRETE

    const expiresIn=process.env.JWT_EXPIRES_IN
    
    const token=jwt.sign(data, secrete ,{expiresIn}) //{expiresIn:"1h"}
    
    return token
}
