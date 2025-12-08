import { changePasswordModel, createUser,getAllUsersModel,getUser, saveResetToken } from "../models/userModels.js";
import bcrypt from "bcryptjs";
import { createAccessToken,signRefreshToken } from "../Utils/Token.js";
import { updateTeacherStatus} from "../models/classesModles.js";
import { deleteRefreshToken, getRefreshToken } from "../models/refreshTokenModel.js";
import { saveRefreshToken } from "../models/refreshTokenModel.js";
import { generateVerificationToken } from "../Utils/Token.js";
import { sendEmail } from "../Utils/sendEmails.js";



export const registerUser=async(req, res)=>{
    const {name,password,email,role,selectedClassId}=req.body


    const existingUser= await getUser(email)
    if(existingUser){
        console.log("User already exists  with this email");
        return res.status(400).json({message:"User already exists with this email"})   
    }

    try{
        const {token, expressAt}= generateVerificationToken()

        console.log("Verification Token:", token, "Expires At:", expressAt);

        const newUser=await createUser(password,email,role,name, expressAt,token)
        console.log(newUser);
        
        await sendEmail(email,"Verify your email","Please verify your email", name, token ,"verifyEmail")
        console.log("User created succesfully , check your email for verification.");
        if(newUser.role==="teacher"){
            console.log(newUser);
            updateTeacherStatus(selectedClassId,newUser.name ,newUser.id)
        }
       return res.status(200).json(newUser)
    }catch(e){
        console.error("Error registering user:", e);     
        return res.status(500).json({message:`error occured , ${e}`})
    }
}


export const logUser =async (req, res)=>{
    const {password ,email} =req.body.data
    try{
        const existingUser = await getUser(email);
    
        if(!existingUser){
            console.log("User Not found");
            return res.status(400).json({message:"User not found"})
        }
        const hashPassword= existingUser.password
        const isValid= await bcrypt.compare(password,hashPassword)
        if(isValid){
            console.log("User logged in Successfully.");
            const id=existingUser.id
            const role =existingUser.role

            const accessToken= createAccessToken({id,role})
            const {refreshToken,tokenHash,tokenPrefix} = signRefreshToken()

            await saveRefreshToken(id, tokenHash,tokenPrefix,role)
            console.log(accessToken);
            

            const access_token=accessToken
            existingUser.token=access_token
            console.log(existingUser);
            

              res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,      // JS cannot read it
                    secure: false,       // change to true in production with HTTPS
                    sameSite: "Strict", // CSRF protection
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
            res.status(200).json({existingUser})
        }else{
            console.log("Email or Password Incorrect.");
        }  
    }catch(e)
    {
        console.log("An error occured try to login", e); 
    }
} 


export const getAllusersController= async (req,res)=>{
try{
    const allStudents = await getAllUsersModel()
    if (allStudents.length === 0){
        return res.status(400).json({message:"Couldn't get students"})
    }else{
        return res.status(200).json({allStudents})
    }
 }catch(e){
    console.log(e);
    }
}






export const logOutController = async(req, res)=>{
    try{
    const refreshToken =req.cookies.refreshToken
    console.log("Refresh Token from cookies:", refreshToken);

    if(!refreshToken){
        console.log("No refresh token found in cookies , user already logged out");
        return res.status(200).json({message:"Log Out successfully"})
    }
    const token_prefix = refreshToken.slice(0,10)

    const storedToken = await getRefreshToken(token_prefix)

    if(storedToken){
        const isMatch= bcrypt.compare(refreshToken,storedToken.token_hash)
        if(isMatch){
            await deleteRefreshToken(storedToken.id)
        }
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });
    console.log("User logged out successfully");
    return res.json({ message: "Logged out successfully" });

    }catch(e){
        console.error(e);
        res.status(500).json({ message: "Server error" });
        }
}

export const  requestResetController= async (req,res)=>{
try{
    const { email } = req.body
    const existingEmail = await getUser(email)
    const name = existingEmail.name
    if(existingEmail){
        const { token,expressAt} =  generateVerificationToken()
        

       const result= await saveResetToken(token,expressAt,existingEmail.id)
        await sendEmail(email,"Reset Your Password",
                        "Please click the link below to reset your password",name,token,"resetPassword")
                        
        return res.json({message:"Please check your email inbox for a password reset link."}).status(200)                  
    }else{
        return res.json({message:"User not found"}).status(400)
    }
        }catch(e){
            console.log(e);
            return res.json({message:"Server error"}).status(500)
}

}

export const changePasswordController=async(req,res)=>{
    try{
        const {newPassword,userId}=req.body
        const result = await changePasswordModel(userId,newPassword)
        console.log(result);
        return res.status(200).json({message:"Password reset successful."})

    }catch(e){
        return res.status(500).json({message:"Server error" + e})
    }
}



