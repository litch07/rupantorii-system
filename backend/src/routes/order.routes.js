import { Router } from "express";
import { createOrderHandler } from "../controllers/order.controller.js";
import { handleValidation, validateOrderCreate } from "../utils/validators.js";

const router = Router();

router.post("/", validateOrderCreate, handleValidation, createOrderHandler);

export default router;
