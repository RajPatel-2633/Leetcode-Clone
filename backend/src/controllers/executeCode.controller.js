import { db } from "../libs/db.libs.js";
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
        // console.log("Result----");
        // console.log(results);


        let allPassed = true;
        const detailedResults = results.map((result,i)=>{
            const stdout = result.stdout?.trim();
            const expected_output = expected_outputs[i]?.trim();

            const passed = stdout === expected_output;
            // console.log(`TestCase #${i+1}`);
            // console.log(`Input ${stdin[i]}`);
            // console.log(`Expected Output for test case #${i+1} is ${expected_output}`)
            // console.log(`Actual Output for test case #${i+1} is ${stdout}`)
            // console.log(`Matched: ${passed} for Test Case #${i+1}`);

            return {
                testCase:i+1,
                passed,
                stdout,
                expected:expected_output,
                stderr:result.stderr || null,
                compile_output: result.compile_output || null,
                status:result.status.description,
                memory:result.memory?`${result.memory}KB`:undefined,
                time:result.time?`${result.time}s`:undefined
            }
        });

        // console.log(detailedResults);

        const submission = await db.submission.create({
            data:{
                userId,
                problemId,
                sourceCode:source_code,
                language_id:getLanguage(language_id),
                stdin:stdin.join("\n"),
                stdout:JSON.stringify(detailedResults.map((r)=>r.stdout)),
                stderr:detailedResults.some((r)=> r.stderr? JSON.stringify(detailedResults.map((r)=>r.stderr)):null),
                compileOutput:detailedResults.some((r)=>r.compile_output? JSON.stringify(detailedResults.map((r)=>r.compile_output)):null),
                status:allPassed?"Accepted":"Wrong Answer",
                memory: detailedResults.some((r)=> r.memory?JSON.stringify(detailedResults.map((r)=>r.memory)):null),
                time:detailedResults.some((r)=> r.time?JSON.stringify(detailedResults.map((r)=>r.time)):null)
            }
        });

        // Now if all the testcases pass then mark the problem solved for current user

        if(allPassed){
            await db.problemSolved.upsert({
                where:{
                    userId_problemId:{
                        userId,problemId
                    },
                    update:{

                    },
                    create:{
                        userId,problemId
                    }
                }
            })
        }

        // Now we want to save all the individual test case results using detailed result
        const testCaseResults = detailedResults.map((result)=>({
            submissionId:submission.id,
            testCase:result.testCase,
            passed:result.passed,
            stdout:result.stdout,
            expected:result.expected,
            stderr:result.stderr,
            compileOutput:result.compileOutput,
            status:result.status,
            memory:result.memory,
            time:result.time
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
}

export {executeCode};