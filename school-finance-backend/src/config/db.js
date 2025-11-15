import pg from "pg"

import dotenv from "dotenv";


const {Pool}=pg;

dotenv.config()

const credentials={
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}

const pool = new Pool(credentials)


try{
    pool.connect()
    console.log("Connected Successfully.")
    console.log(dotenv);
    console.log(Pool)
    
}catch(error){
    console.error("Database connnection failed :", error)
}

export default pool 



 