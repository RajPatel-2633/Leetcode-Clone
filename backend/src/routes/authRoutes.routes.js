import express from "express"
import { registerUser,loginUser,checkUser,logOut} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register",registerUser);

router.post("/login",loginUser);

router.get("/check",authMiddleware,checkUser);

router.post("/logout",authMiddleware,logOut);



export default router;