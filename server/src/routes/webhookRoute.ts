import express from 'express'
import { verifyPaymentbank } from '../controllers/webhookController.js'


const webhookRouter = express.Router()


webhookRouter.post("/verify-payment-bank",verifyPaymentbank)

export default webhookRouter