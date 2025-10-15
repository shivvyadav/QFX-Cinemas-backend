import "dotenv/config";

import express from "express";
import {clerkMiddleware} from "@clerk/express";
import cors from "cors";
import mongoose from "mongoose";
import axios from "axios";
import {serve} from "inngest/express";
import {inngest, functions} from "./inngest/index.js";

const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.MONGO_URL;

// Middleware
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
  cors({
    origin: ["http://localhost:8000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({client: inngest, functions}));

// Connect to MongoDB
mongoose
  .connect(URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
