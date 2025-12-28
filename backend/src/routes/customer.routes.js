import { Router } from "express";
import {
  createAddressHandler,
  deleteAddressHandler,
  getProfile,
  listAddressHandler,
  listCustomerOrdersHandler,
  login,
  register,
  updateAddressHandler,
  updateAvatar,
  updatePassword,
  updateProfile
} from "../controllers/customer.controller.js";
import { requireAuth, requireCustomer } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  handleValidation,
  validateAddressCreate,
  validateAddressUpdate,
  validateCustomerRegister,
  validateIdParam,
  validateLogin,
  validatePasswordChange,
  validateProfileUpdate
} from "../utils/validators.js";

const router = Router();

router.post("/auth/register", validateCustomerRegister, handleValidation, register);
router.post("/auth/login", validateLogin, handleValidation, login);
router.get("/auth/me", requireAuth, requireCustomer, getProfile);
router.put("/auth/profile", requireAuth, requireCustomer, validateProfileUpdate, handleValidation, updateProfile);
router.put(
  "/auth/password",
  requireAuth,
  requireCustomer,
  validatePasswordChange,
  handleValidation,
  updatePassword
);
router.post("/auth/avatar", requireAuth, requireCustomer, upload.single("avatar"), updateAvatar);

router.get("/account/addresses", requireAuth, requireCustomer, listAddressHandler);
router.post("/account/addresses", requireAuth, requireCustomer, validateAddressCreate, handleValidation, createAddressHandler);
router.put(
  "/account/addresses/:id",
  requireAuth,
  requireCustomer,
  validateIdParam,
  validateAddressUpdate,
  handleValidation,
  updateAddressHandler
);
router.delete("/account/addresses/:id", requireAuth, requireCustomer, validateIdParam, handleValidation, deleteAddressHandler);

router.get("/account/orders", requireAuth, requireCustomer, listCustomerOrdersHandler);

export default router;
