// routes/bookingRoutes.js
import express from "express";
import {getMyBookings, getAllBookings} from "../controllers/bookingController.js";
import {requireAuth} from "@clerk/express";

const bookingRouter = express.Router();

bookingRouter.get("/my", requireAuth(), getMyBookings);
bookingRouter.get("/all", getAllBookings);

export default bookingRouter;
