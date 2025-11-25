import createStudentModel,{getAllStudents, getClassStudentsModel, getHeighestSeq, getStudentsModel} from "../models/studentsModels.js";
import { getClassById } from "../models/classesModles.js";

export const createStudentController = async(req,res) =>{
  console.log(req.body);
  
    const {fullName,defaultFee,selectedClassId} = req.body;
  try{
    const classs= await getClassById(selectedClassId)
    const nextSeq= await getHeighestSeq(selectedClassId)


    const studentId=`${classs.class_number}${nextSeq.toString().padStart(3,"0")}`
    console.log("The Student ID:",studentId);

    const result = await createStudentModel(fullName,studentId,defaultFee,selectedClassId,nextSeq)
   return res.status(200).json({result})
  }catch(e){
  console.log(e)
  }

}

export const getStudentsController=async (req,res)=>{
  const {class_id} = req.body
  try{
    const result = await getStudentsModel(class_id)
    if (result.length === 0){
      return res.status(401).json({message:"No student found"})
    }

    return res.status(200).json({result})
  }catch(e){
    console.log(e);
    
  }
}


export const getAllStudentsController=async(req,res)=>{
  const result = getAllStudents()
  res.json({result})
}

export const getClassStudentsController=async(req,res)=>{
    const classId = req.params.class_id

    
try{
    const result = await getClassStudentsModel(classId)
    return res.status(200).json({result})
}catch(e){
    console.log(e);
}

}

