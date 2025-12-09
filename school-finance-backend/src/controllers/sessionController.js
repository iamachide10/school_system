import { checkActiveSessionModel, confirmSessionsModel, finishSessionModel, getAllPendingSessionsModel, getAllSessionModel, getRecordsByIdModel, getSessionById, startSessionModel, submitSessionModel } from "../models/sessionModel.js"


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
    console.log("Submitting");
    
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
        console.log("No records found for sessionId:", sessionId);
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


export const getAllPendingSessionController=async(req,res)=>{
    try{
        const result =await getAllPendingSessionsModel()
        if(!result ){
            return res.status(200).json({message:"No pending sessions yet"})
        } 

        return res.status(200).json({message:"Pending sessions found" , result})

    }catch(e){
        return res.json({message:"Sever error"+e})

    }
}

export const confirmSessionsController=async(req,res)=>{
try{
    const { sessionId } = req.params
    console.log(sessionId);
    
    const confirmSession = await confirmSessionsModel(sessionId)
    if (!confirmSession){
        console.log(confirmSession);
        
        console.log("Session not found");
        return res.json({message:"Session not found"}).status(400)
    }
    console.log("Session confirmed")
    return res.json({message:"Session confirmed successfully."}).status(200)
  }catch(e){
    console.log(e);
}

}