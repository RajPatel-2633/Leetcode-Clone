import {ApiResponse} from "../utils/ApiReponse.utils.js";
import { db } from "../libs/db.libs.js";
import { BadRequestError, NotFoundError } from "../utils/ApiError.utils.js";


const getAllListDetails  = async(req,res,next)=>{
    try{
        const playlists = await db.playlist.findMany({
            where:{
                userId:req.user.id
            },includes:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        });

        return res.status(200).json(ApiResponse.success(playlists,"Fetched all the playlist"));
    } catch(err){
        next(err);
    }
};


const getPlayListDetails = async(req,res,next)=>{
    try{
         const {playlistId} = req.params;
        const playlist = await db.playlist.findUnique({
            where:{
                id:playlistId,
                userId:req.user.id
            },include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        });
        if(!playlist){
            throw new NotFoundError("Cannot Find Playlist");
        }
        return res.status(200).json(ApiResponse.success(playlist,"Playlist Fetched Successfully"));

    } catch(err){
        next(err);
    }
};

const createPlaylist = async(req,res,next)=>{
    try{
        const {name,description} = req.body;
        const userId = req.user.id;
        const playlist = await db.playlist.create({
            data:{
                name,
                description,
                userId
            }
        });

        return res.status(201).json(ApiResponse.create(playlist,"Playlist Created Successfully"));
    } catch(err){
        next(err);
    }
};

const addProblemtoPlaylist = async(req,res,next)=>{
    try{
        // This controller works for single problem selected as well as multiple problem selected
        const {playlistId} = req.params;
        const {problemIds} = req.body;// [{id1},{id2},{id3}]...
        if(!Array.isArray(problemIds)|| problemIds.length===0){
            throw new BadRequestError("ProblemIDs are required or Incorrect Problem ID format");
        }
        // Create Record for Each Problem in the Playlist;
         const problemsinPlaylist = await db.probleminPlaylist.createMany({
            data:problemIds.map((problemId)=>({
                playlistId,
                problemId
            }))
         });

         return res.status(201).json(ApiResponse.created(problemsinPlaylist,"Playlist Created Successully"));

    } catch(err){
        next(err);
    }
};

const deletePlaylist = async(req,res,next)=>{
    try{
        const {playlistId} = req.params;
        const deletedPlaylist = await db.playlist.delete({
            where:{
                id:playlistId
            }
        });

        return res.status(200).json(ApiResponse.success(deletePlaylist,"Playlist Deleted Successfully"));
    } catch(err){
        next(err);
    }
};

const removeProblemFromPlaylist = async(req,res,next)=>{
    try{
        const {playlistId} = req.params;
        const {problemIds} = req.body;
        if(!Array.isArray(problemIds) || problemIds.length===0){
            throw new BadRequestError("Problem IDs are required or incorrect problemIDs format");
        }
        const deletedProblem = await db.probleminPlaylist.deleteMany({
            where:{
                playlistId,
                problemId:{
                    in:problemIds
                }

            }
        });

        return res.status(200).json(ApiResponse.success(deletedProblem,"Problems removed from the playlist successfully"));
    } catch(err){
        next(err);
    }
};


export {getAllListDetails,getPlayListDetails,createPlaylist,addProblemtoPlaylist,deletePlaylist,removeProblemFromPlaylist};