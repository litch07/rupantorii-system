import { body, param, query, validationResult } from "express-validator";

const statusValues = ["active", "hidden", "out_of_stock"];
const sortValues = ["newest", "price_asc", "price_desc", "top_rated"];
const orderStatusValues = ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"];

export const validatePagination = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("q").optional().trim().escape(),
  query("minPrice").optional().isFloat({ min: 0 }).toFloat(),
  query("maxPrice").optional().isFloat({ min: 0 }).toFloat(),
  query("sort").optional().isIn(sortValues)
];

export const validateTrackOrder = [
  query("orderNumber").isString().trim().escape().notEmpty(),
  query("phone").isString().trim().escape().notEmpty()
];

export const validateIdParam = [
  param("id").trim().notEmpty().escape()
];

export const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6 })
];

export const validateCustomerRegister = [
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6 }),
  body("name").isString().trim().escape().notEmpty(),
  body("phone").isString().trim().escape().notEmpty(),
  body("addressLine").isString().trim().escape().notEmpty(),
  body("city").isString().trim().escape().notEmpty(),
  body("postalCode").optional({ nullable: true }).isString().trim().escape(),
  body("label").optional({ nullable: true }).isString().trim().escape()
];

export const validateProfileUpdate = [
  body("name").optional({ nullable: true }).isString().trim().escape(),
  body("phone").optional({ nullable: true }).isString().trim().escape()
];

export const validatePasswordChange = [
  body("currentPassword").isString().isLength({ min: 6 }),
  body("newPassword").isString().isLength({ min: 6 })
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
  body("discountType").optional({ nullable: true }).isIn(["percentage", "amount"]),
  body("discountValue").optional({ nullable: true }).isFloat({ min: 0 }).toFloat(),
  body("isFeatured").optional().isBoolean().toBoolean(),
  body("stock").optional().isInt({ min: 0 }).toInt(),
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
  body("discountType").optional({ nullable: true }).isIn(["percentage", "amount"]),
  body("discountValue").optional({ nullable: true }).isFloat({ min: 0 }).toFloat(),
  body("isFeatured").optional().isBoolean().toBoolean(),
  body("stock").optional().isInt({ min: 0 }).toInt(),
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
  body("addressId").optional({ nullable: true }).isString().trim().escape(),
  body("customerEmail").optional({ nullable: true }).isEmail().normalizeEmail(),
  body("notes").optional({ nullable: true }).isString().trim().escape(),
  body("paymentMethod").optional().isIn(["cod"]),
  body("items").isArray({ min: 1 }),
  body("items.*.productId").isString().trim().escape().notEmpty(),
  body("items.*.variantId").optional({ nullable: true }).isString().trim().escape(),
  body("items.*.quantity").isInt({ min: 1 }).toInt()
];

export const validateOrderStatus = [
  body("status").isIn(orderStatusValues),
  body("cancelReason").optional({ nullable: true }).isString().trim().escape()
];

export const validateAddressCreate = [
  body("label").optional({ nullable: true }).isString().trim().escape(),
  body("recipientName").isString().trim().escape().notEmpty(),
  body("phone").isString().trim().escape().notEmpty(),
  body("addressLine").isString().trim().escape().notEmpty(),
  body("city").isString().trim().escape().notEmpty(),
  body("postalCode").optional({ nullable: true }).isString().trim().escape(),
  body("notes").optional({ nullable: true }).isString().trim().escape(),
  body("isDefault").optional().isBoolean().toBoolean()
];

export const validateAddressUpdate = [
  body("label").optional({ nullable: true }).isString().trim().escape(),
  body("recipientName").optional().isString().trim().escape(),
  body("phone").optional().isString().trim().escape(),
  body("addressLine").optional().isString().trim().escape(),
  body("city").optional().isString().trim().escape(),
  body("postalCode").optional({ nullable: true }).isString().trim().escape(),
  body("notes").optional({ nullable: true }).isString().trim().escape(),
  body("isDefault").optional().isBoolean().toBoolean()
];

export const validateReviewCreate = [
  body("rating").isInt({ min: 1, max: 5 }).toInt(),
  body("title").optional({ nullable: true }).isString().trim().escape(),
  body("comment").isString().trim().escape().notEmpty()
];

export const validateReviewReply = [
  body("reply").isString().trim().escape().notEmpty()
];

export const validateQuestionCreate = [
  body("question").isString().trim().escape().notEmpty()
];

export const validateQuestionAnswer = [
  body("answer").isString().trim().escape().notEmpty()
];

export function handleValidation(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  return next();
}
