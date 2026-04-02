import {db} from "../libs/db.libs.js"
import { ApiResponse } from "../utils/ApiReponse.utils.js";

const getAllSubmissions = async(req,res,next)=>{
    try{
        const userId = req.user.id;
        const submissions = await db.submission.findMany({
            where:{ userId:userId}
        });

         return res.status(200).json(ApiResponse.success(submissions,"Submissions Fetched Successfully"));

    } catch(err){
        next(err);
    }
}

const getSubmissions = async(req,res,next)=>{
    try{
        const problemId = req.params;
        const userId = req.user.id;

        const submissions = await db.submission.findMany({
            where:{
                userId:userId,
                problemId:problemId
            }
        });

        return res.status(200).json(ApiResponse.success(submissions,"Submissions Fetched Successfully"));
        
    } catch(err){
        next(err);
    }
}

const getAlltheSubmissionsforProblem = async(req,res,next)=>{
    try{
        const problemId = req.params;
        const submission = await db.submission.count({
            where:{
                problemId:problemId
            }
        });

        return res.status(200).json(ApiResponse.success({count:submission},"Submission Count Fetched Successfully"));


    } catch(err){
        next(err);
    }
}

export {getAllSubmissions,getSubmissions,getAlltheSubmissionsforProblem};