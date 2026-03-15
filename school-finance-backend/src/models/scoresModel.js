import pool from "../config/db.js"

export const getAllSubjectsModel = async () => {
  const result = await pool.query("SELECT * FROM subjects ORDER BY name ASC")
  return result.rows
}

export const getScoresModel = async (class_id, subject_id, semester) => {
  // Returns one row per student in the class, with score data if it exists
  const result = await pool.query(
    `SELECT
       s.student_code,
       s.full_name,
       sc.class_test,
       sc.mid_sem,
       sc.exam,
       sc.total
     FROM students s
     LEFT JOIN scores sc
       ON  sc.student_code = s.student_code
       AND sc.class_id     = $1
       AND sc.subject_id   = $2
       AND sc.semester     = $3
     WHERE s.class_id = $1
     ORDER BY s.id ASC`,
    [class_id, subject_id, semester]
  )
  return result.rows
}

export const saveScoresModel = async (class_id, subject_id, semester, scores) => {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    for (const s of scores) {
      const { student_code, class_test, mid_sem, exam } = s
      await client.query(
        `INSERT INTO scores (student_code, class_id, subject_id, semester, class_test, mid_sem, exam)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (student_code, class_id, subject_id, semester)
         DO UPDATE SET
           class_test = EXCLUDED.class_test,
           mid_sem    = EXCLUDED.mid_sem,
           exam       = EXCLUDED.exam,
           updated_at = NOW()`,
        [student_code, class_id, subject_id, semester, class_test, mid_sem, exam]
      )
    }

    await client.query("COMMIT")
  } catch (e) {
    await client.query("ROLLBACK")
    throw e
  } finally {
    client.release()
  }
}
