import express from "express"

import { registerUser,logUser, getAllusersController,logOutController,forgotPasswordUserController } from "../controllers/userControllers.js";
import { emailVerificationController } from "../controllers/emailVerificationContoller.js";


const router=express.Router()

router.post("/register",registerUser)
router.post("/login",logUser)
router.get("/existing_students",getAllusersController)
router.post("/logout",logOutController)    
router.get("/verify_email/:token", emailVerificationController) 
router.post("/password_link", forgotPasswordUserController)


export default router