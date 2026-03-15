import pg from "pg"
import dotenv from "dotenv";

const { Pool } = pg;

dotenv.config()

const isLocal = process.env.FRONTEND_URL === "http://localhost:5173"

const credentials = {
    user:     process.env.DB_USER,
    host:     process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port:     process.env.DB_PORT,
    ssl:      isLocal ? false : { rejectUnauthorized: false }
}

const pool = new Pool(credentials)

try {
    pool.connect()
    console.log("Connected Successfully.")
} catch (error) {
    console.error("Database connection failed :", error)
}

export default pool
 