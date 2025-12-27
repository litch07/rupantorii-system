import { Router } from "express";
import { getPublicProduct, listPublicProducts } from "../controllers/product.controller.js";
import { handleValidation, validateIdParam, validatePagination } from "../utils/validators.js";

const router = Router();

router.get("/", validatePagination, handleValidation, listPublicProducts);
router.get("/:id", validateIdParam, handleValidation, getPublicProduct);

export default router;
