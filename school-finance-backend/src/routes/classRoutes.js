import express from "express"
import { classCreate, getAllClassesController } from "../controllers/classControllers.js";
import { verifiyToken } from "../middleware/verifyToken.js";



const router =express.Router()

router.post("/create_class", classCreate)
router.get("/getallclasses",getAllClassesController)


export default router