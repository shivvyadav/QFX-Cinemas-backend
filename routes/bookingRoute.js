// routes/bookingRoutes.js
import express from "express";
import {createBooking, getMyBookings, getAllBookings} from "../controllers/bookingController.js";
import {requireAuth} from "@clerk/express";

const bookingRouter = express.Router();

bookingRouter.post("/create", requireAuth(), createBooking);
bookingRouter.get("/my", requireAuth(), getMyBookings);
bookingRouter.get("/all", getAllBookings);

export default bookingRouter;
