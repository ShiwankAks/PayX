import  express  from "express";
import { currentUser, login, signup } from "../controllers/authController.js";
import verifyToken from "../middlewares/authMiddleware.js";


const authRouter = express.Router()

authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.get("/user",verifyToken,currentUser)

export default authRouter