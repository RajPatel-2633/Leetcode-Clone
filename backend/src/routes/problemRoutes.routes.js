import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import {createProblem,getAllProblems,getProblemByID,deleteProblem,getAllProblemsByUser} from "../controllers/problem.controllers.js"

const router = express.Router();

router.post('/create-problem',authMiddleware,checkAdmin,createProblem);

router.get('/get-all-problems',authMiddleware,getAllProblems);

router.get('/get-problem/:id',authMiddleware,getProblemByID);

router.delete('/delete-problem/:id',authMiddleware,checkAdmin,deleteProblem);

router.get('/get-solved-problems',authMiddleware,getAllProblemsByUser);

export default router;