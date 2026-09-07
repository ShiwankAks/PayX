import "dotenv/config"
import express from 'express'




const app = express()
const PORT = 3001

// Middlewares
app.use(express.json())


// Routes
import transferRouter from "./routes/transferRoute"

app.use("/api",transferRouter)



app.listen(PORT,()=>{
    console.log(`Bank is running on port ${PORT}`)
})
