import { db } from "../libs/db.libs.js";
import { BadRequestError, NotFoundError } from "../utils/ApiError.utils.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async(req,res,next)=>{
    const token = req.cookies?.jwt;
    try{
        if(!token){
            throw new BadRequestError("Token is required");
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await db.user.findUnique({
            where:{
                id:decoded.id
            },
            select:{
                id:true,
                image:true,
                name:true,
                email:true,
                role:true
            }
        })

        if(!user){
            throw new NotFoundError("User not Found");
        }

        req.user = user;
        next();

    } catch(err){
        console.log(err);
        if (err.name === "JsonWebTokenError") {
            return next(new UnauthorizedError("Invalid JWT"));
        }

        if (err.name === "TokenExpiredError") {
            return next(new UnauthorizedError("JWT expired"));
        }

        next(err);
    }
}