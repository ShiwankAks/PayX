import "dotenv/config"
import express from 'express'
import cors from 'cors'


const app = express()
const PORT = 3000

// Middlewares
app.use(express.json())
app.use(cors())


// Routes
import authRouter from "./routes/authRoute.js"
import walletRouter from "./routes/walletRoute.js"
import transferRouter from "./routes/transferRoute.js"
import webhookRouter from "./routes/webhookRoute.js"


app.use("/api/auth",authRouter)
app.use("/api/wallet",walletRouter)
app.use("/api/transfer",transferRouter)
app.use("/api/webhook",webhookRouter)



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
