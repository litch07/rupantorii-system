import { body, param, query, validationResult } from "express-validator";

const statusValues = ["active", "hidden"];
const orderStatusValues = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export const validatePagination = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("q").optional().trim().escape(),
  query("minPrice").optional().isFloat({ min: 0 }).toFloat(),
  query("maxPrice").optional().isFloat({ min: 0 }).toFloat()
];

export const validateIdParam = [
  param("id").trim().notEmpty().escape()
];

export const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6 })
];

export const validateCategoryCreate = [
  body("name").isString().trim().escape().notEmpty(),
  body("slug").optional().isString().trim().escape(),
  body("description").optional({ nullable: true }).isString().trim().escape()
];

export const validateCategoryUpdate = [
  body("name").optional().isString().trim().escape(),
  body("slug").optional().isString().trim().escape(),
  body("description").optional({ nullable: true }).isString().trim().escape()
];

export const validateProductCreate = [
  body("name").isString().trim().escape().notEmpty(),
  body("slug").optional().isString().trim().escape(),
  body("description").isString().trim().escape().notEmpty(),
  body("categoryId").isString().trim().escape().notEmpty(),
  body("brand").optional({ nullable: true }).isString().trim().escape(),
  body("basePrice").isFloat({ min: 0 }).toFloat(),
  body("status").optional().isIn(statusValues),
  body("variants").optional().isArray(),
  body("variants.*.sku").optional().isString().trim().escape().notEmpty(),
  body("variants.*.size").optional({ nullable: true }).isString().trim().escape(),
  body("variants.*.color").optional({ nullable: true }).isString().trim().escape(),
  body("variants.*.material").optional({ nullable: true }).isString().trim().escape(),
  body("variants.*.price").optional({ nullable: true }).isFloat({ min: 0 }).toFloat(),
  body("variants.*.stock").optional().isInt({ min: 0 }).toInt()
];

export const validateProductUpdate = [
  body("name").optional().isString().trim().escape(),
  body("slug").optional().isString().trim().escape(),
  body("description").optional().isString().trim().escape(),
  body("categoryId").optional().isString().trim().escape(),
  body("brand").optional({ nullable: true }).isString().trim().escape(),
  body("basePrice").optional().isFloat({ min: 0 }).toFloat(),
  body("status").optional().isIn(statusValues),
  body("variants").optional().isArray(),
  body("variants.*.sku").optional().isString().trim().escape().notEmpty(),
  body("variants.*.size").optional({ nullable: true }).isString().trim().escape(),
  body("variants.*.color").optional({ nullable: true }).isString().trim().escape(),
  body("variants.*.material").optional({ nullable: true }).isString().trim().escape(),
  body("variants.*.price").optional({ nullable: true }).isFloat({ min: 0 }).toFloat(),
  body("variants.*.stock").optional().isInt({ min: 0 }).toInt()
];

export const validateOrderCreate = [
  body("customerName").isString().trim().escape().notEmpty(),
  body("customerPhone").isString().trim().matches(/^[0-9+\-\s]{6,20}$/),
  body("address").isString().trim().escape().notEmpty(),
  body("city").isString().trim().escape().notEmpty(),
  body("notes").optional({ nullable: true }).isString().trim().escape(),
  body("paymentMethod").optional().isIn(["cod"]),
  body("items").isArray({ min: 1 }),
  body("items.*.productId").isString().trim().escape().notEmpty(),
  body("items.*.variantId").optional({ nullable: true }).isString().trim().escape(),
  body("items.*.quantity").isInt({ min: 1 }).toInt()
];

export const validateOrderStatus = [
  body("status").isIn(orderStatusValues)
];

export function handleValidation(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return next();
}
