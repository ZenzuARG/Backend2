import { Router } from "express";

import ProductDAO from "../dao/mongo/ProductDAO.js";
import ProductRepository from "../repositories/ProductRepository.js";
import ProductService from "../services/product.service.js";
import ProductsController from "../controllers/products.controller.js";

import { authCurrent } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

const router = Router();

// DI simple (sin contenedor, pero prolijo)
const productDao = new ProductDAO();
const productRepo = new ProductRepository(productDao);
const productService = new ProductService(productRepo);
const controller = new ProductsController(productService);

// públicos
router.get("/", controller.list);
router.get("/:pid", controller.get);

// admin only
router.post("/", authCurrent, authorizeRoles("admin"), controller.create);
router.put("/:pid", authCurrent, authorizeRoles("admin"), controller.update);
router.delete("/:pid", authCurrent, authorizeRoles("admin"), controller.remove);

export default router;
