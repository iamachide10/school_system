import { getVerificationToken } from "../models/emailVerificationModel.js";
import { verifyUserEmail } from "../models/emailVerificationModel.js";
import { saveRefreshToken } from "../models/refreshTokenModel.js";
import { createAccessToken, signRefreshToken } from "../Utils/Token.js";



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
        const tokensAccess= createAccessToken(data)
        const {refreshToken,tokenHash,tokenPrefix}=signRefreshToken()

        await saveRefreshToken(existingUser.id,tokenHash,tokenPrefix,existingUser.role)
        console.log(existingUser); 
        existingUser.token=tokensAccess;
              res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,      // JS cannot read it
                    secure: false,       // change to true in production with HTTPS
                    sameSite: "Strict", // CSRF protection
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
        console.log("Email verified successfully.");
        return res.status(200).json({message:"Email verified successfully.", existingUser})

    }catch(e){
        return res.status(500).json({message:`Error occured , ${e}`})
    }
}


export const restTokenVerification=async (req,res)=>{
    try{
        const {token}=req.params
        const result = await getVerificationToken(token)
        
        if(!result){
            console.log("Token not found or expired token");
            return res.status(400).json({valid:false})
        }
        const id=result.id
        console.log("Token found!!");
        return res.status(200).json({valid:true, userId:id})
    }catch(e){
        console.log("Server error",e);
    }

}