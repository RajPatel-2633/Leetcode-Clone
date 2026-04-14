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
                    const allValidationFailures = [];

                    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
                        // Normalize language key to handle "Java" vs "JAVA"
                        const languageId = getJudge0LanguageId(language.trim().toUpperCase());
                        
                        if (!languageId) {
                            allValidationFailures.push({ language, error: "Unsupported language ID" });
                            continue; 
                        }

                        const submissions = testCases.map(({ input, output }) => ({
                            source_code: solutionCode,
                            language_id: languageId,
                            stdin: input,
                            expected_output: output.toString().trim(), // Ensure string & trimmed
                        }));

                        try {
                            const submissionResults = await submitBatch(submissions);
                            const tokens = submissionResults.map((res) => res.token);
                            const results = await pollBatchResults(tokens);

                            results.forEach((result, i) => {
                                if (result.status.id !== 3) {
                                    allValidationFailures.push({
                                        language,
                                        testCase: i + 1,
                                        status: result.status.description,
                                        // Capture the actual error to show the admin
                                        detail: result.stderr || result.compile_output || "Output Mismatch"
                                    });
                                }
                            });
                        } catch (judgeError) {
                            allValidationFailures.push({ language, error: "Judge0 Service Timeout" });
                        }
                    }

                    // 3. Return Detailed Errors instead of 500
                    if (allValidationFailures.length > 0) {
                        return res.status(400).json(
                            ApiResponse.error(
                                "Validation failed for one or more languages",
                                400,
                                allValidationFailures
                            )
                        );
                    }

                    // 4. Database Persistence with Safety Net
                    try {
                        const newProblem = await db.problem.create({
                            data: {
                                title,
                                difficulty,
                                description,
                                tags,
                                examples,
                                constraints: constraints || "No constraints provided.", // Fallback
                                testCases,
                                codeSnippets,
                                referenceSolutions,
                                userId: req.user.id,
                            },
                        });

                        return res.status(201).json(
                            ApiResponse.success(newProblem, "Problem Created Successfully")
                        );
                    } catch (dbError) {
                        // Handle unique constraint (P2002) specifically
                        if (dbError.code === 'P2002') {
                            return res.status(400).json(ApiResponse.error("A problem with this title already exists."));
                        }
                        throw dbError; // Pass other DB errors to global handler (P1001, etc)
                    }

                } catch (err) {
                    console.error("[createProblem] Critical failure", {
                        message: err.message,
                        name: err.name
                    });
                    next(err);
                }
};


const getAllProblems = async(req,res,next)=>{
    try{
        const problems = await db.problem.findMany({
            include: {
                solvedby: true
            }
        });
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

const deleteProblem = async(req,res,next)=>{
    const {id} = req.params;
    try{
        const problem = await db.problem.findUnique({
            where:{id}
        });
        if(!problem){
            throw new NotFoundError("Cannot find problem. Invalid ID");
        }
        await db.problem.delete({
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
                solvedby:{
                    some:{
                        userId: req.user.id
                    }
                }
            },
            include:{
                solvedby:{
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

export {createProblem,getAllProblems,getProblemByID,deleteProblem,getAllProblemsByUser};