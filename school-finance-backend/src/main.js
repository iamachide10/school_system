
import adminDashboardRoutes from "./routes/adminRoutes.js";
import express from "express";
import userRoutes from "./routes/userRoutes.js"
import classRoutes from "./routes/classRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors"
import studentRoute from "./routes/studentRoute.js"
import sessionRouter from "./routes/sessionRoutes.js"
import { refreshTokenController } from "./controllers/refreshTokenController.js";
import cookieParser from "cookie-parser";
import PaymentRoute from "./routes/paymentRoutes.js"
import dotenv from "dotenv"

dotenv.config()


const app=express();


app.use(
  cors({
    origin:process.env.FRONTEND_URL ,
    credentials: true,               // allow cookies
  })
);

app.use(cookieParser())
app.use(express.json())




app.use("/api/users", userRoutes)
app.use("/api/classes", classRoutes)
app.use("/api/student",studentRoute)
app.use("/api/session" , sessionRouter)
app.use("/api/payment" , PaymentRoute)
app.use("/admin/dashboard", adminDashboardRoutes);
app.post("/api/refresh_token", refreshTokenController)



export default app