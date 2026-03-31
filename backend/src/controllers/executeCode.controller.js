import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { BadRequestError, InternalServerError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiReponse.utils.js";

const executeCode = async(req,res,next)=>{
    try{
        const {source_code,language_id,stdin,expected_outputs,problemId} = req.body;
        if(!source_code || !language_id || !stdin || !expected_outputs || !problemId){
            throw new BadRequestError("All Fields are required");
        }
        if(!Array.isArray(stdin)||stdin.length===0|| !Array.isArray(expected_outputs) || expected_outputs.length!==stdin.length){
            throw new BadRequestError("Invalid or missing test cases");
        }
        const submissions = stdin.map((input)=>({
            source_code,language_id,stdin:input
        }));

        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res)=> res.token);

        const results = await pollBatchResults(tokens);
        console.log("Result----");
        console.log(results);
        return res.status(200).json(ApiResponse.success(null,"Code executed successfully"));
    } catch(err){
        next(err);
    }
}

export {executeCode};