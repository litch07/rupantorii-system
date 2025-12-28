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
  getOrderReceiptHandler,
  listAlertsHandler,
  listOrdersHandler,
  updateOrderStatusHandler
} from "../controllers/order.controller.js";
import { answerQuestionHandler, listQuestionsAdmin } from "../controllers/question.controller.js";
import { listReviewsAdmin, replyReviewHandler } from "../controllers/review.controller.js";
import { exportSalesReportHandler, getSalesReportHandler } from "../controllers/report.controller.js";
import { getDashboardInsightsHandler } from "../controllers/dashboard.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  handleValidation,
  validateCategoryCreate,
  validateCategoryUpdate,
  validateIdParam,
  validateQuestionAnswer,
  validateOrderStatus,
  validatePagination,
  validateProductCreate,
  validateProductUpdate,
  validateReviewReply
} from "../utils/validators.js";

const router = Router();

router.use(requireAuth, requireAdmin);

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
router.get("/orders/:id/receipt", validateIdParam, handleValidation, getOrderReceiptHandler);
router.patch("/orders/:id/status", validateIdParam, validateOrderStatus, handleValidation, updateOrderStatusHandler);

router.get("/alerts", listAlertsHandler);
router.get("/dashboard/insights", getDashboardInsightsHandler);

router.get("/reviews", listReviewsAdmin);
router.patch("/reviews/:id/reply", validateIdParam, validateReviewReply, handleValidation, replyReviewHandler);

router.get("/questions", listQuestionsAdmin);
router.patch("/questions/:id/answer", validateIdParam, validateQuestionAnswer, handleValidation, answerQuestionHandler);

router.get("/reports/sales", getSalesReportHandler);
router.get("/reports/sales/export", exportSalesReportHandler);

export default router;
