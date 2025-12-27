import {
  createOrder,
  getOrderById,
  listLowStockAlerts,
  listOrders,
  updateOrderStatus
} from "../services/order.service.js";

function parsePagination(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 20, 100);
  return { page, limit };
}

export async function createOrderHandler(req, res, next) {
  try {
    const order = await createOrder(req.body);
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
      status: req.query.status
    });

    return res.json(result);
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
    const order = await updateOrderStatus(req.params.id, req.body.status);
    return res.json(order);
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
