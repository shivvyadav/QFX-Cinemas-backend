import express from "express";
import {clerkClient, requireAuth, getAuth} from "@clerk/express";

import {
  getNowPlaying,
  addShow,
  deleteShow,
  getActiveShows,
  getShowById,
  updateShow,
  getShowsSummary,
} from "../controllers/showController.js";

const showRouter = express.Router({mergeParams: true});
showRouter.get("/summary", getShowsSummary);
showRouter.get("/now_playing", getNowPlaying);
showRouter.get("/activeShows", getActiveShows);
showRouter.get("/:id", getShowById);
showRouter.post("/addShow", addShow);
showRouter.patch("/:id/occupied", updateShow);
showRouter.delete("/deleteShow/:id", deleteShow);

export default showRouter;
