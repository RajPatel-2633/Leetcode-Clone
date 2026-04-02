import { db } from "../libs/db.libs.js";
import { getJudge0LanguageId,submitBatch ,pollBatchResults} from "../libs/judge0.lib.js";
import { InternalServerError, NotFoundError, UnauthorizedError } from "../utils/ApiError.utils.js";
import {ApiResponse} from "../utils/ApiReponse.utils.js"

const createProblem = async(req,res,next)=>{
    try{
        // get all data from req.body
        // going to check user role once again
        // Loop through each reference solution for different languages
            // Get Judge0 language id for the current language
            // Prepare Judge0 submission for all the testcases
            // Convert submission to chunk of 20
            // Submit all test cases in one batch (this would return tokens)
            // Extract token from the response
            // Poll judge0 untill all submissions are done
            // Validate that each test cases passes(status.id===3)
            // Save the problem in the database after all validation pass
            const {
                title, difficulty, description, tags,
                examples, constraints, testCases,
                codeSnippets, referenceSolutions
            } = req.body;

            if(req.user.role.trim().toLowerCase()!=="admin"){
                throw new UnauthorizedError("Access denied. Admins only")
            }
            for(const[language,solutionCode] of Object.entries(referenceSolutions)){
                const languageId = getJudge0LanguageId(language);
                
                if(!languageId){
                    throw new NotFoundError("Language Not Found");
                }


                const submissions = testCases.map(({input,output})=> ({
                    source_code:solutionCode,
                    language_id:languageId,
                    stdin:input,
                    expected_output:output,
                }))

                // Now the above generated is a batch. Now we need to submit the batch which will hit the judge0 endpoint
                const submissionResults  = await submitBatch(submissions);
                
                const tokens = submissionResults.map((res)=>res.token);

                const results =  await pollBatchResults(tokens);

                for(let i=0;i< results.length;i++){
                    const result = results[i];
                    if(result.status.id !==3){
                        throw new InternalServerError(`Testcase ${i+1}failed for language ${language}`)
                    }
                }

            }
            // save the problem to database
            const newProblem = await db.problem.create({
                data: {
                    title,
                    difficulty,
                    description,
                    tags,
                    examples,
                    constraints,
                    testCases,
                    codeSnippets,
                    referenceSolutions,
                    userId: req.user.id,
                    },
                });

                 return res.status(200).json(
                    ApiResponse.success(newProblem,"Problem Created Successfully")
                 );

            
 } catch(err){
        next(err);
    }
}

const getAllProblems = async(req,res,next)=>{
    try{
        const problems = await db.problem.findMany();
        return res.status(200).json(
    ApiResponse.success(problems, "Problems fetched successfully")
);
    }catch(err){
        next(err);
    }
}

const getProblemByID = async(req,res,next)=>{
    const{id} = req.params;
    try{
        const problem = await db.problem.findUnique({
            where:{
                id
            }
        })
        if(!problem){
            throw new NotFoundError("Problem not found");
        }

        return res.status(200).json(ApiResponse.success(problem,"Problem fetched successfully"));
    } catch(err){
        next(err);
    }
}

const updateProblem =async(req,res,next)=>{

}

const deleteProblem = async(req,res,next)=>{
    const {id} = req.params;
    try{
        const problem = await db.problem.findUnique({
            where:{id}
        });
        if(!problem){
            throw new NotFoundError("Cannot find problem. Invalid ID");
        }
        await db.delete({
            where:{id}
        });
        return res.status(200).json(ApiResponse.success(null,"Deleted Problem Successfully"));
    } catch(err){
        next(err);
    }
}

const getAllProblemsByUser = async(req,res,next)=>{
    try{
        const problems = await db.problem.findMany({
            where:{
                solvedBy:{
                    some:{
                        userId: req.user.id
                    }
                }
            },
            include:{
                solvedBy:{
                    where:{
                        userId:req.user.id
                    }
                }

            }
        })

        return  res.status(200).json(ApiResponse.success(problems,"All the problems for user fetched successfully"));
    } catch(err){
        next(err);
    }
}

export {createProblem,getAllProblems,getProblemByID,updateProblem,deleteProblem,getAllProblemsByUser};