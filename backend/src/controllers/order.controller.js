import {
  createOrder,
  getOrderById,
  listLowStockAlerts,
  listOrders,
  trackOrder,
  updateOrderStatus
} from "../services/order.service.js";
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from "../services/email.service.js";
import { buildOrderReceipt } from "../utils/receipt.js";

function parsePagination(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 20, 100);
  return { page, limit };
}

export async function createOrderHandler(req, res, next) {
  try {
    const userId = req.user?.role === "customer" ? req.user.sub : null;
    const order = await createOrder(req.body, userId);
    if (order?.customerEmail) {
      const receipt = await buildOrderReceipt(order);
      sendOrderConfirmationEmail(order, receipt).catch((error) => {
        console.warn("Order confirmation email failed:", error.message);
      });
    }
    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
}

export async function listOrdersHandler(req, res, next) {
  try {
    const { page, limit } = parsePagination(req.query);
    const result = await listOrders({
      page,
      limit,
      status: req.query.status,
      q: req.query.q
    });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function trackOrderHandler(req, res, next) {
  try {
    const order = await trackOrder(req.query.orderNumber, req.query.phone);
    return res.json(order);
  } catch (error) {
    return next(error);
  }
}

export async function getOrderHandler(req, res, next) {
  try {
    const order = await getOrderById(req.params.id);
    return res.json(order);
  } catch (error) {
    return next(error);
  }
}

export async function updateOrderStatusHandler(req, res, next) {
  try {
    if (req.body.status === "cancelled" && !req.body.cancelReason) {
      return res.status(400).json({ message: "Cancellation reason is required." });
    }

    const order = await updateOrderStatus(req.params.id, req.body.status, req.body.cancelReason);
    if (order?.customerEmail) {
      sendOrderStatusEmail(order).catch((error) => {
        console.warn("Order status email failed:", error.message);
      });
    }
    return res.json(order);
  } catch (error) {
    return next(error);
  }
}

export async function getOrderReceiptHandler(req, res, next) {
  try {
    const order = await getOrderById(req.params.id);
    const pdfBuffer = await buildOrderReceipt(order);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=order-${order.orderNumber}.pdf`);
    return res.send(pdfBuffer);
  } catch (error) {
    return next(error);
  }
}

export async function listAlertsHandler(req, res, next) {
  try {
    if (req.query.lowStock !== "true") {
      return res.json({ message: "No alerts requested" });
    }

    const alerts = await listLowStockAlerts();
    return res.json(alerts);
  } catch (error) {
    return next(error);
  }
}
