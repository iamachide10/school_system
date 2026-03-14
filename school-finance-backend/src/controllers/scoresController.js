import { getAllSubjectsModel, getScoresModel, saveScoresModel } from "../models/scoresModel.js"
import { getClassById } from "../models/classesModles.js"

const LIMITS = { class_test: 20, mid_sem: 20, exam: 60 }

// GET /api/scores/subjects
export const getSubjectsController = async (req, res) => {
  try {
    const result = await getAllSubjectsModel()
    return res.status(200).json({ result })
  } catch (e) {
    console.log("Error at getSubjectsController", e)
    return res.status(500).json({ message: "Server error" })
  }
}

// GET /api/scores/:class_id?subject_id=&semester=
export const getScoresController = async (req, res) => {
  const { class_id } = req.params
  const { subject_id, semester } = req.query
  const { user } = req

  try {
    // Only the class teacher can access scores
    const classs = await getClassById(class_id)
    if (!classs) return res.status(404).json({ message: "Class not found" })

    if (user.role !== "teacher" || user.id !== parseInt(classs.teacher_id)) {
      return res.status(403).json({ message: "Access denied" })
    }

    if (!subject_id || !semester) {
      return res.status(400).json({ message: "subject_id and semester are required" })
    }

    const result = await getScoresModel(class_id, subject_id, semester)
    return res.status(200).json({ result })
  } catch (e) {
    console.log("Error at getScoresController", e)
    return res.status(500).json({ message: "Server error" })
  }
}

// POST /api/scores/:class_id
export const saveScoresController = async (req, res) => {
  const { class_id } = req.params
  const { subject_id, semester, scores } = req.body
  const { user } = req

  try {
    const classs = await getClassById(class_id)
    if (!classs) return res.status(404).json({ message: "Class not found" })

    if (user.role !== "teacher" || user.id !== parseInt(classs.teacher_id)) {
      return res.status(403).json({ message: "Access denied" })
    }

    if (!subject_id || !semester || !Array.isArray(scores) || scores.length === 0) {
      return res.status(400).json({ message: "subject_id, semester, and scores array are required" })
    }

    // Validate each score row
    for (const s of scores) {
      for (const [field, max] of Object.entries(LIMITS)) {
        const val = Number(s[field])
        if (isNaN(val) || val < 0 || val > max) {
          return res.status(400).json({
            message: `Invalid value for ${field}: must be between 0 and ${max}`
          })
        }
      }
    }

    await saveScoresModel(class_id, subject_id, semester, scores)
    return res.status(200).json({ message: "Scores saved successfully" })
  } catch (e) {
    console.log("Error at saveScoresController", e)
    return res.status(500).json({ message: "Server error" })
  }
}
