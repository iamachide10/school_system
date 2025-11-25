import { createUser ,getAllUsersModel,getUser } from "../models/userModels.js";
import bcrypt from "bcryptjs";
import { createToken } from "../Utils/Token.js";
import { updateTeacherStatus} from "../models/classesModles.js";


export const registerUser=async(req, res)=>{
    const {name,password,email,role,selectedClassId}=req.body
    console.log(req.body);
    const existingUser= await getUser(email)
    if(existingUser){
        console.log("User already exists  with this email");
        return res.status(400).json({message:"User already exists with this email"})   
    }
    try{
        const newUser=await createUser(password,email,role,name)

        if(newUser.role==="teacher"){
            console.log(newUser);
            updateTeacherStatus(selectedClassId,newUser.name ,newUser.id)
        }
        res.status(200).json(newUser)
        
    }catch(e){
        res.status(500).json({message:`error occured , ${e}`})
        
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
            console.log(existingUser);
            const token= createToken({existingUser})
            console.log(token);
            existingUser.token=token
            res.status(200).json({existingUser})
        }else{
            console.log("Email or Password Incorrect.");
        }  
    }catch(e)
    {
        console.log("An error occured trying to login", e); 
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

