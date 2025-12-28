import prisma from "../config/database.js";

const SALES_STATUSES = ["confirmed", "shipped", "delivered"];

export async function getDashboardInsights(limit = 6) {
  const safeLimit = Math.min(Math.max(Number(limit) || 6, 1), 9);

  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    select: { id: true, name: true, slug: true, status: true }
  });

  if (featuredProducts.length === 0) {
    return { totals: { itemsSold: 0 }, topProducts: [] };
  }

  const featuredIds = featuredProducts.map((product) => product.id);

  const [soldAgg, ratingAgg] = await Promise.all([
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        productId: { in: featuredIds },
        order: {
          status: { in: SALES_STATUSES }
        }
      },
      _sum: { quantity: true }
    }),
    prisma.productReview.groupBy({
      by: ["productId"],
      where: { productId: { in: featuredIds } },
      _avg: { rating: true },
      _count: { _all: true }
    })
  ]);

  const soldMap = new Map();
  let totalSold = 0;
  soldAgg.forEach((row) => {
    const soldCount = row._sum.quantity || 0;
    soldMap.set(row.productId, soldCount);
    totalSold += soldCount;
  });

  const ratingMap = new Map();
  const reviewCountMap = new Map();
  ratingAgg.forEach((row) => {
    ratingMap.set(row.productId, Number(row._avg.rating || 0));
    reviewCountMap.set(row.productId, row._count._all || 0);
  });

  const topProducts = featuredProducts
    .map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      status: product.status,
      soldCount: soldMap.get(product.id) || 0,
      rating: ratingMap.get(product.id) || 0,
      reviewCount: reviewCountMap.get(product.id) || 0
    }))
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.soldCount - a.soldCount;
    })
    .slice(0, safeLimit);

  return {
    totals: { itemsSold: totalSold },
    topProducts
  };
}
