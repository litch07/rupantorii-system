import { Prisma } from "@prisma/client";
import prisma from "../config/database.js";

const LOW_STOCK_THRESHOLD = 5;

/**
 * Creates an order and decrements variant stock atomically.
 */
export async function createOrder(payload) {
  const { customerName, customerPhone, address, city, notes, paymentMethod, items } = payload;

  const productIds = [...new Set(items.map((item) => item.productId))];
  const variantIds = [...new Set(items.map((item) => item.variantId).filter(Boolean))];

  const [products, variants] = await Promise.all([
    prisma.product.findMany({ where: { id: { in: productIds } } }),
    variantIds.length ? prisma.productVariant.findMany({ where: { id: { in: variantIds } } }) : []
  ]);

  const productMap = new Map(products.map((product) => [product.id, product]));
  const variantMap = new Map(variants.map((variant) => [variant.id, variant]));

  let totalAmount = new Prisma.Decimal(0);

  const orderItems = items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      const error = new Error("Invalid product selected");
      error.status = 400;
      throw error;
    }

    let variant = null;
    let price = product.basePrice;

    if (item.variantId) {
      variant = variantMap.get(item.variantId);

      if (!variant || variant.productId !== product.id) {
        const error = new Error("Invalid variant selected");
        error.status = 400;
        throw error;
      }

      if (variant.stock < item.quantity) {
        const error = new Error(`Insufficient stock for ${variant.sku}`);
        error.status = 400;
        throw error;
      }

      if (variant.price !== null) {
        price = variant.price;
      }
    }

    const lineTotal = new Prisma.Decimal(price).times(item.quantity);
    totalAmount = totalAmount.plus(lineTotal);

    return {
      productId: product.id,
      variantId: variant ? variant.id : null,
      quantity: item.quantity,
      price
    };
  });

  const orderNumber = `RUP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        address,
        city,
        notes: notes || null,
        paymentMethod: paymentMethod || "cod",
        totalAmount,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      }
    });

    for (const item of items) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        });
      }
    }

    return order;
  });
}

export async function listOrders({ page = 1, limit = 20, status }) {
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  const [total, data] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    })
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return { data, total, page, totalPages };
}

export async function getOrderById(id) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
          variant: true
        }
      }
    }
  });

  if (!order) {
    const error = new Error("Order not found");
    error.status = 404;
    throw error;
  }

  return order;
}

export async function updateOrderStatus(id, status) {
  return prisma.order.update({
    where: { id },
    data: { status }
  });
}

export async function listLowStockAlerts() {
  const variants = await prisma.productVariant.findMany({
    where: { stock: { lte: LOW_STOCK_THRESHOLD } },
    include: { product: true },
    orderBy: { stock: "asc" }
  });

  return {
    threshold: LOW_STOCK_THRESHOLD,
    items: variants
  };
}
