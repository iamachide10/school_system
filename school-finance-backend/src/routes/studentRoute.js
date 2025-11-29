import express from "express"
import { createStudentController,getAllStudentsController,getClassStudentsController,getStudentsController } from "../controllers/studentContoller.js"
import { verifiyToken } from "../middleware/verifyToken.js"

const router = express.Router() 

router.post("/create_student",createStudentController)
router.get("/get_student",getStudentsController)
router.get("/getallstudents" ,getAllStudentsController)
router.post("/get_class_students/:class_id",verifiyToken, getClassStudentsController)

export default router
