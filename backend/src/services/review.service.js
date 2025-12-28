import prisma from "../config/database.js";

export async function listProductReviews(productId) {
  return prisma.productReview.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function listReviewsForAdmin() {
  return prisma.productReview.findMany({
    include: {
      product: true,
      user: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createReview(productId, userId, payload) {
  const { rating, title, comment } = payload;

  const purchase = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: { in: ["confirmed", "shipped", "delivered"] }
      }
    }
  });

  if (!purchase) {
    const error = new Error("Only verified buyers can review this product.");
    error.status = 403;
    throw error;
  }

  try {
    return await prisma.productReview.create({
      data: {
        productId,
        userId,
        rating,
        title: title || null,
        comment,
        verifiedPurchase: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });
  } catch (error) {
    if (error.code === "P2002") {
      const err = new Error("You have already reviewed this product.");
      err.status = 409;
      throw err;
    }
    throw error;
  }
}

export async function replyToReview(reviewId, reply) {
  return prisma.productReview.update({
    where: { id: reviewId },
    data: {
      reply,
      repliedAt: new Date()
    },
    include: {
      product: true,
      user: { select: { id: true, name: true, email: true } }
    }
  });
}
