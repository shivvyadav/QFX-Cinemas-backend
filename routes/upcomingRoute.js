import express from "express";
import {getUpcoming} from "../controllers/upcomingController.js";

const upcomingRouter = express.Router();
upcomingRouter.get("/upcoming", getUpcoming);

export default upcomingRouter;
