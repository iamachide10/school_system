import express from "express"

import { registerUser,logUser, getAllusersController,logOutController, requestResetController, changePasswordController } from "../controllers/userControllers.js";
import { emailVerificationController, restTokenVerification } from "../controllers/emailVerificationContoller.js";


const router=express.Router()

router.post("/register",registerUser)
router.post("/login",logUser)
router.get("/existing_students",getAllusersController)
router.post("/logout",logOutController)    
router.get("/verify_email/:token", emailVerificationController) 
router.post("/request-reset", requestResetController)
router.get("/verify_reset_token/:token",restTokenVerification)
router.post("/reset_password",changePasswordController)


export default router