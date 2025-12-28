import { Router } from "express";
import { getPublicProduct, listPublicProducts } from "../controllers/product.controller.js";
import { createQuestionHandler, listQuestions } from "../controllers/question.controller.js";
import { createReviewHandler, listReviews } from "../controllers/review.controller.js";
import { requireAuth, requireCustomer } from "../middleware/auth.js";
import {
  handleValidation,
  validateIdParam,
  validatePagination,
  validateQuestionCreate,
  validateReviewCreate
} from "../utils/validators.js";

const router = Router();

router.get("/", validatePagination, handleValidation, listPublicProducts);
router.get("/:id", validateIdParam, handleValidation, getPublicProduct);
router.get("/:id/reviews", validateIdParam, handleValidation, listReviews);
router.post(
  "/:id/reviews",
  requireAuth,
  requireCustomer,
  validateIdParam,
  validateReviewCreate,
  handleValidation,
  createReviewHandler
);
router.get("/:id/questions", validateIdParam, handleValidation, listQuestions);
router.post(
  "/:id/questions",
  requireAuth,
  requireCustomer,
  validateIdParam,
  validateQuestionCreate,
  handleValidation,
  createQuestionHandler
);

export default router;
