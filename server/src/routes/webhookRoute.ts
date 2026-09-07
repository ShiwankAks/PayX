import express from 'express'
import { verifyPayment } from '../controllers/webhookController.js'


const webhookRouter = express.Router()

webhookRouter.post("/verify-payment",verifyPayment)

export default webhookRouter