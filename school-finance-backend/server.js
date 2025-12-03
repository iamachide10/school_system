import dotenv from "dotenv"
import app from "./src/main.js"


dotenv.config()

const PORT =process.env.PORT;


app.listen(PORT , ()=>{
    console.log("Server running on PORT ", PORT)
})