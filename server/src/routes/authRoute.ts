import  express  from "express";
import { currentUser, login, signup } from "../controllers/authController.js";
import verifyToken from "../middlewares/authMiddleware.js";
import { authRateLimit } from "../middlewares/rateLimit.js";


const authRouter = express.Router()

authRouter.post("/signup",authRateLimit,signup)
authRouter.post("/login",authRateLimit,login)
authRouter.get("/user",verifyToken,currentUser)

export default authRouter