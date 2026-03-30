import {ApiResponse} from "../utils/ApiReponse.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";

const errorHandler = async(err,req,res,next)=>{
    let error = err;
    if(!(error instanceof ApiError)){
        error = new ApiError(
            error.message || "Internal Server Error",
            error.statusCode || 500,
            [],
            err.stack,
            null
        );
    }
    const response = ApiResponse.error(
        error.message,
        error.statusCode,
        {
            errors:error.errors,
            details:error.details,
        }

    );
    
    res.status(error.statusCode).json(response);
}

export default errorHandler;