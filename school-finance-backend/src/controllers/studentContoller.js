import createStudentModel,{getAllStudents, getClassStudentsModel, getHeighestSeq, getStudentByIdModel, getStudentsModel,  updateStudentModel} from "../models/studentsModels.js";
import { getClassById } from "../models/classesModles.js";
import { getStudentWithFeesModel  } from "../models/studentsModels.js";


export const createStudentController = async(req,res) =>{
  console.log(req.body);
  
    const {fullName,defaultFee,selectedClassId} = req.body;
  try{
    const classs= await getClassById(selectedClassId)
    
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
  console.log("It working");
  
  const {studentId}= req.params;
  try{
    const result= await getStudentByIdModel(studentId);
    console.log("The student ", result);
    res.status(200).json({result})

  }catch(e){
    console.log("Error " ,e);
    
  }
  

}




export async function getStudentWithFeesController(req, res) {
  try {
    const {student_id}=req.params;
    
    const data = await getStudentWithFeesModel(Number(student_id));

    if (!data) return res.status(404).json({ message: "Student not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export async function updateStudentController(req, res) {
  console.log("Working")
  try {
    const { student_code } = req.params;
    const { full_name, default_fees, phone } = req.body;

    // Basic validation: at least one field must be provided
    if (
      full_name === undefined &&
      default_fees === undefined &&
      phone === undefined
    ) {
      return res.status(400).json({
        message: "Provide at least one field to update"
      });
    }

    const updatedStudent = await updateStudentModel(
      student_code,
      { full_name, default_fees, phone }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent
    });

  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}
