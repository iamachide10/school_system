import express from "express";
import userRoutes from "./routes/userRoutes.js"

import cors from "cors"
import pool from "./config/db.js";


const app=express();

app.use(cors())
app.use(express.json())


app.use("/api/users", userRoutes)

app.get("/" , async(req,res)=>{
    try{
        const result = await pool.query("SELECT name,password ,email FROM users")
        res.json(result.rows)
    }catch(e){
        console.log(e);
    }
})



export default app