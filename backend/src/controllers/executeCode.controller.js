import { db } from "../libs/db.libs.js";
import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { BadRequestError, InternalServerError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiReponse.utils.js";

const executeCode = async(req,res,next)=>{
    try{
        const userId = req.user?.id;
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
        let allPassed = true;
        const detailedResults = results.map((result,i)=>{
            const stdout = result.stdout?.trim();
            const expected_output = expected_outputs[i]?.trim();

            const passed = stdout === expected_output;
            if (!passed) allPassed = false;
            return {
                testCase:i+1,
                passed,
                stdout,
                expected:expected_output,
                status:result.status.description,
                memory:result.memory?`${result.memory}KB`:undefined,
                time:result.time?`${result.time}s`:undefined
            }
        });

        const submission = await db.submission.create({
            data:{
                userId,
                problemId,
                sourceCode:source_code,
                language:getLanguageName(language_id),
                stdin:stdin.join("\n"),
                stdout:JSON.stringify(detailedResults.map((r)=>r.stdout)),
                status:allPassed?"Accepted":"Wrong Answer",
                memory: detailedResults.some(r=> r.memory)? JSON.stringify(detailedResults.map(r=>r.memory)):null,
                time:detailedResults.some(r=> r.time)?JSON.stringify(detailedResults.map(r=>r.time)):null
            }
        });

        // Now if all the testcases pass then mark the problem solved for current user

        if(allPassed){
            await db.problemSolved.upsert({
                where:{
                    userId_problemId:{
                        userId,problemId
                    }
                },
                    update:{

                    },
                    create:{
                        userId,problemId
                    }
                }
            )
        }
        // Dont forget to add Status in each test case as well as in Model

        // Now we want to save all the individual test case results using detailed result
        const testCaseResults = detailedResults.map((result)=>({
            submissionId:submission.id,
            testCase:result.testCase,
            passed:result.passed,
            stdout:result.stdout ?? null,
            expected:result.expected,
            memory:result.memory ?? null,
            time:result.time ?? null
        }));

        await db.testCaseResult.createMany({
            data:testCaseResults
        });


        const submissionWithTestCase = await db.submission.findUnique({
            where:{
                id:submission.id,
            },
            include:{
                testCases:true
            }
        });


        return res.status(200).json(ApiResponse.success(submissionWithTestCase,"Code executed successfully"));
    } catch(err){
        next(err);
    }
};



export {executeCode};