import express from 'express'
import { onRampTransfer } from '../controllers/onRampController'

const onRampRouter = express.Router()

onRampRouter.post("/transfer-bank",onRampTransfer)

export default onRampRouter