import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmissions , getAlltheSubmissionsforProblem,getSubmissions } from "../controllers/submission.controller.js";

const router = express.Router();


router.get("/get-all-submissions",authMiddleware,getAllSubmissions);
router.get("/get-submission/:problemId",authMiddleware,getSubmissions);
router.get("/get-submission-count/:problemId",authMiddleware,getAlltheSubmissionsforProblem);

export default router;