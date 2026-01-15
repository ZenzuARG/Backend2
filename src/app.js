import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import dotenv from "dotenv";

import usersRouter from "./routes/users.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import { initializePassport } from "./config/passport.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mongo
mongoose.connect(process.env.MONGODB_URI);

// Passport
initializePassport();
app.use(passport.initialize());

// Routes
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
