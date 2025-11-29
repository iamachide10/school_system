import express from "express"
import { finishSessionController, getAllSessionController, getRecordsByIdController, startSessionController, submitSessionController } from "../controllers/sessionController.js"

const router= express.Router()

router.post("/start_session" , startSessionController)
router.post("/submit_session" , submitSessionController)
router.get("/:sessionId/records" , getRecordsByIdController)
router.get("/all_session",getAllSessionController)
router.post("/finish_session",finishSessionController)

export default router