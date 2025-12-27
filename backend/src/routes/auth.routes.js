import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { handleValidation, validateLogin } from "../utils/validators.js";

const router = Router();

router.post("/login", validateLogin, handleValidation, login);

export default router;
