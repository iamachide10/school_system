import {createClass ,getAllClassesModel} from "../models/classesModles.js"

export const classCreate=async (req,res)=>{
    try{
        const { classNumber,className}=req.body;
        console.log(req.body);
        
        const newClass=await createClass(className,  classNumber)
        console.log(newClass);
        return res.json({newClass , message:"class created successfully"}).status(200)
    }catch(e){
        console.log(e);
        
    }
}


export const getAllClassesController=async(req,res)=>{
    try{
        const result = await getAllClassesModel();
        if(result.length===0){
            return res.status(401).json({message:"No classes were found."})
        }
        return res.status(200).json({result})
    }catch(e){
        console.log(e);
    }
}