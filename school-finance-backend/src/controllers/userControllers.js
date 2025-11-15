import { createUser } from "../models/userModels.js";


export const registerUser=async(req, res)=>{
    const {name,password,email,role}=req.body
    console.log(req.body);
    
    try{
        const newUser=await createUser(password,email,role,name)
        res.status(200).json(newUser)
    }catch(e){
        res.status(500).json({message:`error occured , ${e}`})
        
    }
}