import express from 'express'
import verifyToken from '../middlewares/authMiddleware.js'
import { findReciever, transferBalance, transferHistory } from '../controllers/transferController.js'


const transferRouter = express.Router()

transferRouter.post("/transfer-balance/:receiverId",verifyToken,transferBalance)
transferRouter.get("/users",verifyToken,findReciever)
transferRouter.get("/transfer-history",verifyToken,transferHistory)

export default transferRouter