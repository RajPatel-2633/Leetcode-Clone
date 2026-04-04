import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {getAllListDetails,getPlayListDetails,createPlaylist,addProblemtoPlaylist,deletePlaylist,removeProblemFromPlaylist} from "../controllers/playList.controller.js"

const router = express.Router();

router.get("/",authMiddleware,getAllListDetails);

router.get("/:playlistId",authMiddleware,getPlayListDetails);

router.post("/create-playlist",authMiddleware,createPlaylist);

router.post("/:playlistId/add-problem",authMiddleware,addProblemtoPlaylist);

router.delete("/:playlistId",authMiddleware,deletePlaylist);

router.delete("/:playlistId/remove-problem",authMiddleware,removeProblemFromPlaylist);

export default router;