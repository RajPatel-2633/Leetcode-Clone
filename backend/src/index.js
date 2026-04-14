import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorMiddleware.middleware.js";
import authRoutes from "./routes/authRoutes.routes.js";
import problemRoutes from "./routes/problemRoutes.routes.js";
import executeCodeRoutes from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playListRoutes from "./routes/playList.routes.js";

dotenv.config({});
const app = express();
const PORT = process.env.PORT || 8080;

// 1. HARDCODED ORIGIN (Ensures 100% string match with Vercel)
const ALLOWED_ORIGIN = "https://leet-space-frontend.vercel.app";

app.use((req, res, next) => {
  // Use .header for native Express compatibility
  res.header("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Expose-Headers", "Set-Cookie");

  // Handle the Preflight (OPTIONS) request immediately
  if (req.method === "OPTIONS") {
    // 2. Switching to 200 to ensure headers are never stripped by proxies
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executeCodeRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playListRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.info("[server] started", { port: PORT });
});