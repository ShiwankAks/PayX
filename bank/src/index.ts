import "dotenv/config"
import express from 'express'




const app = express()
const PORT = 3001

// Middlewares
app.use(express.json())


// Routes
import transferRouter from "./routes/transferRoute"
import onRampRouter from "./routes/onRampRoute"

app.use("/api/p2p",transferRouter)
app.use("/api/b2p",onRampRouter)



app.listen(PORT,()=>{
    console.log(`Bank is running on port ${PORT}`)
})
