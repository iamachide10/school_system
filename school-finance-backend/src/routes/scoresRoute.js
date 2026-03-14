import express from "express"
import { getSubjectsController, getScoresController, saveScoresController } from "../controllers/scoresController.js"
import { verifiyToken } from "../middleware/verifyToken.js"

const router = express.Router()

router.get("/subjects", verifiyToken, getSubjectsController)
router.get("/:class_id", verifiyToken, getScoresController)
router.post("/:class_id", verifiyToken, saveScoresController)

export default router
