import { NextFunction, Request, Response } from "express"
import  jwt  from "jsonwebtoken"
import { customPayload } from "../types/express.js"



const verifyToken = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const token= req.header("Authorization")?.replace("Bearer ","")
        if (!token) {
            return res.status(401).json({message:"Unauthorized access"})
        }
        const decodedToken =  jwt.verify(token,process.env.JWT_SECRET!) as customPayload
        req.user = decodedToken
        next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({status:"failed",message:"Please login"})
    }
}


export default verifyToken