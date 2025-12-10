import { changePasswordModel, createUser,getAllUsersModel,getUser, saveResetToken } from "../models/userModels.js";
import bcrypt from "bcryptjs";
import { createAccessToken,signRefreshToken } from "../Utils/Token.js";
import { updateTeacherStatus} from "../models/classesModles.js";
import { deleteRefreshToken, getRefreshToken } from "../models/refreshTokenModel.js";
import { saveRefreshToken } from "../models/refreshTokenModel.js";
import { generateVerificationToken } from "../Utils/Token.js";
import { sendEmail } from "../Utils/sendEmails.js";



export const registerUser = async (req, res) => {
  const { name, password, email, role, selectedClassId } = req.body;

  try {
    // 1. CHECK IF USER EXISTS
    const existingUser = await getUser(email);
    if (existingUser) {
      console.log("User already exists with this email");
      return res.status(200).json({
        status: "exists",
        message: "If an account with this email exists, you will receive further information."
      });
    }

    // 2. GENERATE VERIFICATION TOKEN
    const { token, expressAt } = generateVerificationToken();
    console.log("Verification Token:", token, "Expires At:", expressAt);

    // 3. CREATE USER
    const newUser = await createUser(
      password,
      email,
      role,
      name,
      expressAt,
      token
    );

    await sendEmail(
      email,
      "Verify your School System account",
      "Please verify your email address",
      name,
      token,
      "verifyEmail"
    );

    console.log("User created successfully. Verification email sent.");


    if (newUser.role === "teacher") {
      await updateTeacherStatus(selectedClassId, newUser.name, newUser.id);
    }


    return res.status(200).json({
      status: "success",
      message: "Account created! Check your email to verify your account.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (e) {
    console.error("Error registering user:", e);

    return res.status(500).json({
      status: "error",
      message: "Something went wrong while creating your account. Please try again."
    });
  }
};


export const logUser = async (req, res) => {
  const { email, password } = req.body.data;

  try {
    // 1. CHECK IF USER EXISTS
    const existingUser = await getUser(email);

    if (!existingUser) {
      console.log("User not found");
      return res.status(404).json({
        status: "not_found",
        message: "No account found with this email."
      });
    }

    // 2. CHECK PASSWORD
    const isValid = await bcrypt.compare(password, existingUser.password);

    if (!isValid) {
      console.log("Invalid password");
      return res.status(401).json({
        status: "invalid_credentials",
        message: "Incorrect email or password."
      });
    }

    // 3. CHECK EMAIL VERIFICATION
    if (!existingUser.verified) {
      console.log("Unverified account");
      return res.status(401).json({
        status: "unverified",
        message: "Please verify your email before logging in."
      });
    }

    // 4. USER VERIFIED → ISSUE TOKENS
    const id = existingUser.id;
    const role = existingUser.role;

    const accessToken = createAccessToken({ id, role });
    const { refreshToken, tokenHash, tokenPrefix } = signRefreshToken();

    // SAVE REFRESH TOKEN
    await saveRefreshToken(id, tokenHash, tokenPrefix, role);

    // SET REFRESH COOKIE
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,          // use TRUE in production with HTTPS
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log("Login successful");

    // RETURN SANITIZED USER DATA + ACCESS TOKEN
    return res.status(200).json({
      status: "success",
      message: "Login successful.",
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      access_token: accessToken
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      status: "error",
      message: "Something went wrong while logging in. Please try again."
    });
  }
};



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



