import "dotenv/config";

import express from "express";
import {clerkMiddleware} from "@clerk/express";
import cors from "cors";
import mongoose from "mongoose";
import {serve} from "inngest/express";
import {inngest, functions} from "./inngest/index.js";
import showRouter from "./routes/showRoute.js";
import upcomingRouter from "./routes/upcomingRoute.js";
import contactRouter from "./routes/contactRoute.js";
import movieDetailRouter from "./routes/movieDetailRouter.js";
import adminRouter from "./routes/adminRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import paymentRouter from "./routes/paymentRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.MONGO_URL;

// Connect to MongoDB
mongoose
  .connect(URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// cron
import "./utils/bookingExpiryCron.js";

// Middleware
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// api routes
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/inngest", serve({client: inngest, functions}));
app.use("/api/shows", showRouter);
app.use("/api/movieDetail", movieDetailRouter);
app.use("/api/movies", upcomingRouter);
app.use("/api/contact", contactRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/khalti", paymentRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
