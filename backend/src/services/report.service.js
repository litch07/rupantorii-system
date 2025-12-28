import prisma from "../config/database.js";

function toNumber(value) {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

export async function getSalesReport(range = "overall") {
  const [total, totalAmount, byStatus] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { totalAmount: true }
    })
  ]);

  let series = [];
  if (range === "daily") {
    series = await prisma.$queryRaw`
      SELECT DATE_TRUNC('day', "createdAt") AS period,
             COUNT(*)::int AS orders,
             COALESCE(SUM("totalAmount"), 0) AS revenue
      FROM "Order"
      GROUP BY period
      ORDER BY period DESC
      LIMIT 14
    `;
  }

  if (range === "weekly") {
    series = await prisma.$queryRaw`
      SELECT DATE_TRUNC('week', "createdAt") AS period,
             COUNT(*)::int AS orders,
             COALESCE(SUM("totalAmount"), 0) AS revenue
      FROM "Order"
      GROUP BY period
      ORDER BY period DESC
      LIMIT 12
    `;
  }

  if (range === "yearly") {
    series = await prisma.$queryRaw`
      SELECT DATE_TRUNC('year', "createdAt") AS period,
             COUNT(*)::int AS orders,
             COALESCE(SUM("totalAmount"), 0) AS revenue
      FROM "Order"
      GROUP BY period
      ORDER BY period DESC
    `;
  }

  return {
    totals: {
      orders: total,
      revenue: toNumber(totalAmount._sum.totalAmount)
    },
    byStatus: byStatus.map((row) => ({
      status: row.status,
      orders: row._count._all,
      revenue: toNumber(row._sum.totalAmount)
    })),
    range,
    series: (series || []).map((row) => ({
      period: row.period,
      orders: row.orders,
      revenue: toNumber(row.revenue)
    }))
  };
}
