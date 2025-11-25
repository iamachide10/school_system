import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const verifiyToken=(req, res , next)=>{
    const authHeader=req.headers["authorization"]

    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(400).json({message:"Token not found"})
    }
    const secrete = process.env.JWT_SECRETE
    const verifiyFunction=(err , decoded)=>{
        if(err){
            return res.status(403).json({message: "Invalid or Expired Token"})
        }

        req.user=decoded
    }
    jwt.verify(token , secrete , )
}


