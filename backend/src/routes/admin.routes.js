import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from "../controllers/category.controller.js";
import {
  createProductHandler,
  deleteProductHandler,
  deleteProductImageHandler,
  getAdminProduct,
  listAdminProducts,
  updateProductHandler,
  uploadProductImages
} from "../controllers/product.controller.js";
import {
  getOrderHandler,
  listAlertsHandler,
  listOrdersHandler,
  updateOrderStatusHandler
} from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  handleValidation,
  validateCategoryCreate,
  validateCategoryUpdate,
  validateIdParam,
  validateOrderStatus,
  validatePagination,
  validateProductCreate,
  validateProductUpdate
} from "../utils/validators.js";

const router = Router();

router.use(requireAuth);

router.get("/products", validatePagination, handleValidation, listAdminProducts);
router.post("/products", validateProductCreate, handleValidation, createProductHandler);
router.get("/products/:id", validateIdParam, handleValidation, getAdminProduct);
router.put("/products/:id", validateIdParam, validateProductUpdate, handleValidation, updateProductHandler);
router.delete("/products/:id", validateIdParam, handleValidation, deleteProductHandler);
router.post("/products/:id/images", upload.array("images", 5), uploadProductImages);
router.delete("/products/images/:imageId", deleteProductImageHandler);

router.get("/categories", listCategories);
router.post("/categories", validateCategoryCreate, handleValidation, createCategory);
router.put("/categories/:id", validateIdParam, validateCategoryUpdate, handleValidation, updateCategory);
router.delete("/categories/:id", validateIdParam, handleValidation, deleteCategory);

router.get("/orders", validatePagination, handleValidation, listOrdersHandler);
router.get("/orders/:id", validateIdParam, handleValidation, getOrderHandler);
router.patch("/orders/:id/status", validateIdParam, validateOrderStatus, handleValidation, updateOrderStatusHandler);

router.get("/alerts", listAlertsHandler);

export default router;
