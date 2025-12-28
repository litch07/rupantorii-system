import { Prisma } from "@prisma/client";
import prisma from "../config/database.js";
import { applyDiscount } from "../utils/discount.js";

const LOW_STOCK_THRESHOLD = 10;

/**
 * Creates an order without committing stock until delivery.
 */
export async function createOrder(payload, userId = null) {
  const { customerName, customerPhone, customerEmail, address, city, notes, paymentMethod, items, addressId } = payload;

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

    if (product.status !== "active") {
      const error = new Error("Product is not available for ordering");
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
    } else {
      if (product.stock < item.quantity) {
        const error = new Error("Insufficient stock for this product");
        error.status = 400;
        throw error;
      }
    }

    const discountedPrice = applyDiscount(price, product.discountType, product.discountValue);
    const lineTotal = new Prisma.Decimal(discountedPrice).times(item.quantity);
    totalAmount = totalAmount.plus(lineTotal);

    return {
      productId: product.id,
      variantId: variant ? variant.id : null,
      quantity: item.quantity,
      price: discountedPrice
    };
  });

  const orderNumber = `RUP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

  return prisma.$transaction(async (tx) => {
    let orderUser = null;
    if (userId) {
      orderUser = await tx.user.findUnique({ where: { id: userId } });
    }

    let addressRef = null;
    if (userId && addressId) {
      addressRef = await tx.address.findFirst({
        where: { id: addressId, userId }
      });
      if (!addressRef) {
        const error = new Error("Selected address was not found.");
        error.status = 404;
        throw error;
      }
    }

    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        addressId: addressRef ? addressRef.id : null,
        customerEmail: orderUser?.email || customerEmail || null,
        customerName,
        customerPhone,
        address: addressRef ? addressRef.addressLine : address,
        city: addressRef ? addressRef.city : city,
        notes: notes || null,
        paymentMethod: paymentMethod || "cod",
        totalAmount,
        stockCommitted: false,
        items: {
          create: orderItems
        }
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      }
    });

    return order;
  });
}

export async function listOrders({ page = 1, limit = 20, status, q }) {
  const skip = (page - 1) * limit;
  const where = {};

  if (status) {
    where.status = status;
  }

  if (q) {
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { id: { contains: q, mode: "insensitive" } }
    ];
  }

  const [total, data] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: {
        user: true,
        addressRef: true,
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
      user: true,
      addressRef: true,
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

export async function listOrdersForCustomer(userId) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      addressRef: true,
      items: {
        include: {
          product: true,
          variant: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function trackOrder(orderNumber, customerPhone) {
  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      customerPhone
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

  if (!order) {
    const error = new Error("Order not found. Check the order number and phone.");
    error.status = 404;
    throw error;
  }

  return order;
}

export async function updateOrderStatus(id, status, cancelReason) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
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

    if (status === "delivered" && !order.stockCommitted) {
      for (const item of order.items) {
        if (!item.variantId || !item.variant) {
          if (item.product && item.product.stock < item.quantity) {
            const error = new Error(`Insufficient stock for ${item.product.name}`);
            error.status = 400;
            throw error;
          }
          continue;
        }

        if (item.variant.stock < item.quantity) {
          const error = new Error(`Insufficient stock for ${item.variant.sku}`);
          error.status = 400;
          throw error;
        }
      }

      for (const item of order.items) {
        if (!item.variantId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
          continue;
        }

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        });
      }
    }

    if (status === "cancelled" && order.stockCommitted) {
      for (const item of order.items) {
        if (!item.variantId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          });
          continue;
        }

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } }
        });
      }
    }

    if (status === "returned" && order.stockCommitted) {
      for (const item of order.items) {
        if (!item.variantId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          });
          continue;
        }

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } }
        });
      }
    }

    const updatedOrder = await tx.order.update({
      where: { id },
      data: {
        status,
        ...(status === "delivered" && !order.stockCommitted ? { stockCommitted: true } : {}),
        ...(status === "cancelled" && order.stockCommitted ? { stockCommitted: false } : {}),
        ...(status === "returned" && order.stockCommitted ? { stockCommitted: false } : {}),
        ...(status === "cancelled" ? { cancelReason: cancelReason || null } : { cancelReason: null })
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      }
    });

    return updatedOrder;
  });
}

export async function listLowStockAlerts() {
  const [variants, products] = await Promise.all([
    prisma.productVariant.findMany({
      where: { stock: { lt: LOW_STOCK_THRESHOLD } },
      include: { product: true },
      orderBy: { stock: "asc" }
    }),
    prisma.product.findMany({
      where: { stock: { lt: LOW_STOCK_THRESHOLD }, variants: { none: {} } },
      orderBy: { stock: "asc" }
    })
  ]);

  return {
    threshold: LOW_STOCK_THRESHOLD,
    items: [
      ...variants.map((variant) => ({
        type: "variant",
        id: variant.id,
        sku: variant.sku,
        stock: variant.stock,
        product: variant.product
      })),
      ...products.map((product) => ({
        type: "product",
        id: product.id,
        sku: null,
        stock: product.stock,
        product
      }))
    ]
  };
}
