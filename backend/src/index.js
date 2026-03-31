import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorMiddleware.middleware.js";
import authRoutes from "./routes/authRoutes.routes.js"
import problemRoutes from "./routes/problemRoutes.routes.js"
import executeCodeRoutes from "./routes/executeCode.routes.js"

const app = express();
dotenv.config({});
const PORT = process.env.PORT || 8080 ;

app.use(cors({
    origin:process.env.BASE_URL,
    methods:["GET","POST","PUT","PATCH","DELETE"],
    allowedHeaders:["Content-Type","Cookie"],
    exposedHeaders: ["Set-Cookie"],
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/problems",problemRoutes);
app.use("/api/v1/execute-code",executeCodeRoutes);

app.use(errorHandler);
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})