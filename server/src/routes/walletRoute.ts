import express from 'express'
import verifyToken from '../middlewares/authMiddleware.js'
import { checkBalance } from '../controllers/walletController.js'


const walletRouter = express.Router()

walletRouter.get("/check-balance",verifyToken,checkBalance)

export default walletRouter