import express from "express"
import { createStudentController,getAllStudentsController,getClassStudentsController,getStudentsController } from "../controllers/studentContoller.js"


const router = express.Router() 

router.post("/create_student",createStudentController)
router.get("/get_student",getStudentsController)
router.get("/getallstudents" ,getAllStudentsController)
router.get("/get_class_students/:class_id",getClassStudentsController)

export default router
