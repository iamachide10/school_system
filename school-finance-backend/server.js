import dotenv from "dotenv"
import app from "./src/main.js"
import { createToken } from "./src/Utils/Token.js";
import { verifiyToken } from "./src/middleware/verifyToken.js";

dotenv.config()

const PORT =process.env.PORT;


app.listen(PORT , ()=>{
    console.log("Server running on PORT ", PORT)
})