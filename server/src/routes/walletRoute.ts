import express from 'express'
import verifyToken from '../middlewares/authMiddleware.js'
import { addMoney, checkBalance, onRampTransactions } from '../controllers/walletController.js'
import { transactionLimiter } from '../middlewares/rateLimit.js'


const walletRouter = express.Router()

walletRouter.get("/check-balance",verifyToken,checkBalance)
walletRouter.get("/on-ramp-transactions",verifyToken,onRampTransactions)
walletRouter.post("/add-money",transactionLimiter,verifyToken,addMoney)

export default walletRouter