import express from "express";
import userRoutes from "./routes/userRoutes.js"
import classRoutes from "./routes/classRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors"
import pool from "./config/db.js";
import studentRoute from "./routes/studentRoute.js"


const app=express();

app.use(cors())
app.use(express.json())
app.use(errorHandler)



app.use("/api/users", userRoutes)
app.use("/api/classes", classRoutes)
app.use("/api/student",studentRoute)


export default app