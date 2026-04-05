import axios from "axios"


export const getJudge0LanguageId = (language)=>{
    const languageMap = {
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63,
    }
    
    return languageMap[language.toUpperCase()];
}


export const submitBatch = async(submissions) =>{
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    });

    console.log("Submission Results: ",data);
    return data; // This would be in the form of tokens; [{token},{token},{token}]
    }

export async function getJudge0Result(token) {
    let result;
    while (true) {
        const response = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/${token}`);
        result = response.data;
        if (result.status.id !== 1 && result.status.id !== 2) break;
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return result;
}

export function chunkArray(arr, size = 20) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

const sleep = (ms)=>new Promise((resolve)=> setTimeout(resolve,ms));

export const pollBatchResults = async(tokens)=>{
    while(true){
        const {data} =  await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens:tokens.join(","),
                base64_encoded:false,
            }
        })

        const results = data.submissions;

        const isAllDone = results.every((r)=> r.status.id !==1 && r.status.id !==2)

        if(isAllDone) return results;
        await sleep(1000);

    }
}


export const getLanguageName = (languageId)=>{
    const LANGUAGE_NAMES={
        74:"Typescript",
        63:"Javascript",
        71:"Python",
        62:"Java",
    }
    return LANGUAGE_NAMES[languageId] || "Unknown";
}
