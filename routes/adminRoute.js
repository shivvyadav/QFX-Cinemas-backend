import express from "express";
import {requireAuth} from "@clerk/express";
import {isAdmin} from "../middlewares/auth.js";
import {VerifyAdmin, getAdminSummary} from "../controllers/adminController.js";

const adminRouter = express.Router();

// check if current user is admin
adminRouter.get("/verify", requireAuth(), isAdmin, VerifyAdmin);
adminRouter.get("/summary", getAdminSummary);

export default adminRouter;
