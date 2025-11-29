import { checkActiveSessionModel, finishSessionModel, getAllSessionModel, getRecordsByIdModel, getSessionById, startSessionModel, submitSessionModel } from "../models/sessionModel.js"


export const startSessionController=async(req,res)=>{


    const {teacher_id, class_id}=req.body
    const generateSessionCode=()=>{
         return Math.floor(100000 + Math.random() * 900000).toString();
    }
    const session_code=generateSessionCode()
    const existingSession= await checkActiveSessionModel(class_id)

    if(existingSession){
        console.log("There is already one.");
        
        return res.status(200).json({
                status:"existing",
                message: "Active session already exists",
                session: existingSession
            });
    }
    try{
        const result = await startSessionModel(teacher_id,class_id,session_code)
        return res.status(200).json({
            status:"new",
            message:"New session created",
            session:result
        })
    }catch(e){
        console.log("Error occured ",e);
        
    }
}



export const submitSessionController = async(req,res)=>{
try{
    const { students, sessionId} = req.body    
    for (const student of students){      
        const result = await submitSessionModel(student,sessionId)
    }
    res.status(200).json({message:"Session records submitted successfully"})
}catch(e){
    console.log(e);
}
}


export const getRecordsByIdController = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const records = await getRecordsByIdModel(sessionId);
    if (!records || records.length === 0) {
      return res.status(200).json([]);  // no records yet but valid
    }

    return res.status(200).json(records);
  } catch (error) {
    console.error("getRecordsByIdController error:", error);
    return res.status(500).json({ message: "Server error fetching session records" });
  }
};

export const getAllSessionController=async (req,res)=>{
try{
    const result = await getAllSessionModel()
    if(result.length === 0){
        return null
    }else{
        return res.status(200).json({result})
    }
}catch(e){
    console.log(e)
  }
}


export const finishSessionController=async(req,res)=>{
 try{

     const { sessionId,sessionCode } = req.body
     const storedCode = await getSessionById(sessionId)
     if (storedCode == sessionCode){
         console.log("it the same");
         await finishSessionModel(sessionId)
         return res.json({message:"Session ended successfully"}).status(200)
     
     }else{
         console.log("Incorrect code");
         return res.status(401).json({message:"Incorrect session code"})  
     } 
 }catch(e){
    console.log(e);
    }
}

