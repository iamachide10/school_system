import createStudentModel,{getAllStudents, getClassStudentsModel, getHeighestSeq, getStudentByIdModel, getStudentsModel, updateStudentInfoModel} from "../models/studentsModels.js";
import { getClassById } from "../models/classesModles.js";

export const createStudentController = async(req,res) =>{
  console.log(req.body);
  
    const {fullName,defaultFee,selectedClassId} = req.body;
  try{
    const classs= await getClassById(selectedClassId)
    console.log(classs);
    
    const nextSeq= await getHeighestSeq(selectedClassId)


    const studentId=`${classs.class_number}${nextSeq.toString().padStart(3,"0")}`
    console.log("The Student ID:",studentId);

    const result = await createStudentModel(fullName,studentId,defaultFee,selectedClassId,nextSeq)
   return res.status(200).json({message:"Student created successfully"})
  }catch(e){
  console.log("Error occured at create student controller",e)
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
  return res.json({result})
}


export const getClassStudentsController=async(req,res)=>{
    const classId = req.params.class_id

    const classs=await getClassById(classId)
    const {user}=req

    if(!user){
      return 
    }

    if(user.role!=='teacher' || user.id !==parseInt(classs.teacher_id)){
      return res.status(400).json({message : "Access denied"})
    }
try{
    const result = await getClassStudentsModel(classId)
    return res.status(200).json({result})
}catch(e){
    console.log("Error MUUU" , e);
}

}


export const getStudentByIdContoller=async(req, res)=>{
  const {studentId}= req.params;
  try{
    const result= await getStudentByIdModel(studentId);
    console.log("The student ", result);
    res.status(200).json({result})

  }catch(e){
    console.log("Error " ,e);
    
  }
  

}


export const updateStudentInfoController=async(req,res)=>{
  try{
  const { id,default_fees}=req.body;
  console.log(req.body);
  const result = await updateStudentInfoModel(id,default_fees)
  if(!result){
    return res.json({message:"Student not found."}).status(401)
  }
  return res.json({message:"Info updated successfully."}).status(200)
  

  }catch(e){
  console.log("Error occured at Controller",e); 
}
}

