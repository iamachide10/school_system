import express from "express"
import { confirmSessionsController, finishSessionController, getAllPendingSessionController, getAllSessionController, getRecordsByIdController, startSessionController, submitSessionController } from "../controllers/sessionController.js"

const router= express.Router()

router.post("/start_session" , startSessionController)
router.post("/submit_session" , submitSessionController)
router.get("/:sessionId/records" , getRecordsByIdController)
router.get("/all_session",getAllSessionController)
router.post("/finish_session",finishSessionController)
router.get("/:sessionId/confirm",confirmSessionsController)
router.get("/get_pending_session",getAllPendingSessionController)
export default router