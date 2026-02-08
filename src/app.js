import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";

import { config } from "./config/env.js";
import { initializePassport } from "./config/passport.js";

import usersRouter from "./routes/users.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import productsRouter from "./routes/products.router.js";

import cartsRouter from "./routes/carts.router.js";
import purchaseRouter from "./routes/purchase.router.js";
import passwordResetRouter from "./routes/passwordReset.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mongo
mongoose.connect(config.mongoUri);

// Passport
initializePassport();
app.use(passport.initialize());

// Routes
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/carts", purchaseRouter);
app.use("/api/sessions", passwordResetRouter);

// Error handler (simple y efectivo)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    status: "error",
    message: err.message || "Error interno del servidor"
  });
});

app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
