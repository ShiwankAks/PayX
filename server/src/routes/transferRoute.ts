import express from 'express'
import verifyToken from '../middlewares/authMiddleware.js'
import { findReceiver, transferBalance, transferHistory } from '../controllers/transferController.js'
import { transactionLimiter } from '../middlewares/rateLimit.js'


const transferRouter = express.Router()

transferRouter.post("/transfer-balance",transactionLimiter,verifyToken,transferBalance)
transferRouter.get("/users",verifyToken,findReceiver)
transferRouter.get("/transfer-history",verifyToken,transferHistory)

export default transferRouter