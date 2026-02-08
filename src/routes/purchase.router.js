import { Router } from "express";

import CartDAO from "../dao/mongo/CartDAO.js";
import CartRepository from "../repositories/CartRepository.js";

import ProductDAO from "../dao/mongo/ProductDAO.js";
import ProductRepository from "../repositories/ProductRepository.js";

import TicketDAO from "../dao/mongo/TicketDAO.js";
import TicketRepository from "../repositories/TicketRepository.js";

import PurchaseService from "../services/purchase.service.js";
import PurchaseController from "../controllers/purchase.controller.js";

import { authCurrent } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

const router = Router();

const cartRepo = new CartRepository(new CartDAO());
const productRepo = new ProductRepository(new ProductDAO());
const ticketRepo = new TicketRepository(new TicketDAO());

const purchaseService = new PurchaseService(cartRepo, productRepo, ticketRepo);
const controller = new PurchaseController(purchaseService);

// SOLO USER puede comprar
router.post("/:cid/purchase", authCurrent, authorizeRoles("user"), controller.purchase);

export default router;
