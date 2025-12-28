import { Router } from "express";
import { changeAdminPassword, login } from "../controllers/auth.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { handleValidation, validateLogin, validatePasswordChange } from "../utils/validators.js";

const router = Router();

router.post("/login", validateLogin, handleValidation, login);
router.put(
  "/password",
  requireAuth,
  requireAdmin,
  validatePasswordChange,
  handleValidation,
  changeAdminPassword
);

export default router;
