import { Router } from "express";
import { createOrderHandler, trackOrderHandler } from "../controllers/order.controller.js";
import { optionalAuth } from "../middleware/auth.js";
import { handleValidation, validateOrderCreate, validateTrackOrder } from "../utils/validators.js";

const router = Router();

router.post("/", optionalAuth, validateOrderCreate, handleValidation, createOrderHandler);
router.get("/track", validateTrackOrder, handleValidation, trackOrderHandler);

export default router;
