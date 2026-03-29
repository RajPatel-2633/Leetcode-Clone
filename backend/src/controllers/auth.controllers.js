import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from "../utils/ApiError.utils.js";
import { db } from "../libs/db.libs.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pkg from "@prisma/client";
const {PrismaClient,UserRole}=pkg;
import ApiResponse from "../utils/ApiReponse.utils.js";

const registerUser = async(req,res,next)=>{
    const {email,name, password} = req.body;
    try{
        if(!email || !name || !password ){
            throw new BadRequestError("All fields are required");
        }
        const existingUser = await db.user.findUnique({
            where:{email}
        });

        if(existingUser){
            throw new ConflictError("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await db.user.create({
            data:{
                email,password:hashedPassword,name,role:UserRole.USER
            }
        })

        if(!newUser){
            throw new InternalServerError("Some error occured while creating User");
        }
        return res.status(201).json(ApiResponse.created( { id: newUser.id, email: newUser.email, name: newUser.name },"User created Successfully"));

    } catch (err){
            next(err);
    }
}


const loginUser = async(req,res,next)=>{
    const {email,password} = req.body;
    try{
        if(!email ||!password){
            throw new BadRequestError("All Fields are required");
        }

        const user = await db.user.findUnique({
            where:{email}
        });
        if(!user){
            throw new NotFoundError("User not Found");
        }
        const token = jwt.sign({
            id:user.id,
            role:user.role
        },process.env.JWT_SECRET,{
            expiresIn:"7d"
        });

        res.cookie("jwt",token,{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV!=="development",
            maxAge:1000*60*60*24*7
        })


        return res.status(200).json(ApiResponse.created( { id: user.id, email: user.email, name: user.name , token},"User Logged In Successfully"));

    } catch(err){
        next(err);
    }
}

const checkUser = async(req,res,next)=>{
    try{
        return res.status(200).json(ApiResponse.success( {user:req.user},"User Checked Successfully"))
    } catch(err){
        next(err);
    }
}

const logOut = async(req,res,next)=>{
    try{
        res.clearCookie("jwt",{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV!=="development",
        })

        return res.status(200).json(
           ApiResponse.success(null,"User Logged Out Successfully")
        )
    } catch(err){
        next(err);
    }
}

export {registerUser,loginUser,checkUser,logOut};