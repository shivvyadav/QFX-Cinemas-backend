import express from "express";
import {createPayment, verifyPayment} from "../controllers/paymentController.js";
const paymentRouter = express.Router();

paymentRouter.post("/initiate", createPayment);
paymentRouter.post("/verify", verifyPayment);

export default paymentRouter;
