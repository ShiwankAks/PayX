import express from 'express'
import { bankTransfer } from '../controllers/transferController'


const transferRouter = express.Router()

transferRouter.post("/transfer",bankTransfer)

export default transferRouter