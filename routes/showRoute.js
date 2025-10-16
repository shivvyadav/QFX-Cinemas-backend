import express from "express";
import {getNowPlaying, addShow} from "../controllers/showController.js";

const showRouter = express.Router();
showRouter.get("/now_playing", getNowPlaying);
showRouter.post("/addShow", addShow);

export default showRouter;
