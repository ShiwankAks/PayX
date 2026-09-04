import "dotenv/config"
import express from 'express'
import prisma from "./config/db.js"
import cors from 'cors'




const app = express()
const PORT = 3000

// Middlewares
app.use(express.json())
app.use(cors())


// Routes
import authRouter from "./routes/authRoute.js"

app.use("/api/auth",authRouter)



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
