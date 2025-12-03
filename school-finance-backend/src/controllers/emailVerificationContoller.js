import { getVerificationToken } from "../models/emailVerificationModel.js";
import { verifyUserEmail } from "../models/emailVerificationModel.js";
import { createAccessToken } from "../Utils/Token.js";



export const emailVerificationController=async(req,res)=>{
    try{
        const {token}=req.params
        
        const result = await getVerificationToken(token)
        if(!result){
            console.log("Token not found");
            
            return res.status(401).json({message:"Token not found."}) 
        } 
        
        const existingUser= await verifyUserEmail(result.id)

        const data = {
            id: existingUser.id,
            role: existingUser.role
        }

        console.log(data);
        
        const tokens= createAccessToken(data)
        console.log("tokens" ,tokens);
        
        console.log(existingUser);
        
        existingUser.token=tokens;
        console.log(existingUser);
        console.log("Email verified successfully.");
        return res.status(200).json({message:"Email verified successfully.", existingUser})

    }catch(e){
        return res.status(500).json({message:`Error occured , ${e}`})
    }
}