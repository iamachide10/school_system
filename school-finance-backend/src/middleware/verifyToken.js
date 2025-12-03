import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()


export const verifiyToken=(req, res , next)=>{
    const authHeader=req.headers["authorization"]

    const token = authHeader && authHeader.split(" ")[1]

    console.log("Token from header:", token);       

    if(!token){
        console.log("token Not found");
        return res.status(401).json({message:"Token not found"})
    }
    const secrete = process.env.JWT_SECRETE
    const verifiyFunction=(err , decoded)=>{
        
        if(err){
            console.log("ERRO",err);
            return res.status(401).json({message: "Invalid or Expired Token"})   
        } 
        console.log("Decoded data",decoded);
        req.user=decoded
    }
    jwt.verify(token , secrete ,  verifiyFunction)
    next()
}


