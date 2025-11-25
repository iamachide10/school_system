import express from "express"

import { registerUser,logUser, getAllusersController } from "../controllers/userControllers.js";

const router=express.Router()

router.post("/register",registerUser)
router.post("/login",logUser)
router.get("/existing_students",getAllusersController)


export default router