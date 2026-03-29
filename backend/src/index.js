import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorMiddleware.middleware";

const app = express();
dotenv.config({});
const PORT = process.env.PORT || 8080 ;

app.use(cors({
    origin:process.env.BASE_URL,
    methods:["GET","POST","PUT","PATCH","DELETE"],
    allowedHeaders:["Content-Type"],
    credentials:true
}));

app.use(express.json());
// Import all User Routes Here


app.use(errorHandler);
app.listen(()=>{
    console.log(`Server is running on port ${PORT}`);
})