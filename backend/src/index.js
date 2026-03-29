import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorMiddleware.middleware.js";
import authRoutes from "./routes/authRoutes.routes.js"

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
app.use(cookieParser());

app.use("/api/v1/auth",authRoutes);

app.use(errorHandler);
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})