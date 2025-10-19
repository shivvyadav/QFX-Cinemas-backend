import express from "express";
import {getMovieDetail} from "../controllers/movieDetailController.js";
const movieDetailRouter = express.Router({mergeParams: true});

movieDetailRouter.get("/:id", getMovieDetail);

export default movieDetailRouter;
