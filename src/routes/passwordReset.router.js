import { Router } from "express";

import UserDAO from "../dao/mongo/UserDAO.js";
import UserRepository from "../repositories/UserRepository.js";

import PasswordResetService from "../services/passwordReset.service.js";
import PasswordResetController from "../controllers/passwordReset.controller.js";

import { config } from "../config/env.js";

const router = Router();

const userRepo = new UserRepository(new UserDAO());
const service = new PasswordResetService(userRepo, config);
const controller = new PasswordResetController(service);

// pedir link
router.post("/forgot-password", controller.forgot);

// aplicar reset
router.post("/reset-password", controller.reset);

// demo link (viene en el mail)
router.get("/reset-password-link", controller.resetLink);

export default router;
