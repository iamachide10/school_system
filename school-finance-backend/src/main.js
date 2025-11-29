import express from "express";
import userRoutes from "./routes/userRoutes.js"
import classRoutes from "./routes/classRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors"
import studentRoute from "./routes/studentRoute.js"
import sessionRouter from "./routes/sessionRoutes.js"


const app=express();

app.use(cors())
app.use(express.json())




app.use("/api/users", userRoutes)
app.use("/api/classes", classRoutes)
app.use("/api/student",studentRoute)
app.use("/api/session" , sessionRouter)

export default app