import { Router } from "express";

import CartDAO from "../dao/mongo/CartDAO.js";
import CartRepository from "../repositories/CartRepository.js";

import ProductDAO from "../dao/mongo/ProductDAO.js";
import ProductRepository from "../repositories/ProductRepository.js";

import CartService from "../services/cart.service.js";
import CartsController from "../controllers/carts.controller.js";

import { authCurrent } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

const router = Router();

// DI simple
const cartDao = new CartDAO();
const cartRepo = new CartRepository(cartDao);

const productDao = new ProductDAO();
const productRepo = new ProductRepository(productDao);

const cartService = new CartService(cartRepo, productRepo);
const controller = new CartsController(cartService);

// Ver carrito (lo podés dejar público o protegido; lo dejo protegido)
router.get("/:cid", authCurrent, controller.getCart);

// Agregar producto a carrito: SOLO USER
router.post("/:cid/products/:pid", authCurrent, authorizeRoles("user"), controller.addProduct);

export default router;
