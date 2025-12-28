import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import customerRoutes from "./customer.routes.js";
import orderRoutes from "./order.routes.js";
import productRoutes from "./product.routes.js";

const router = Router();

router.use("/admin/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/", customerRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

export default router;
