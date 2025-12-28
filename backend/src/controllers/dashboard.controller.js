import { getDashboardInsights } from "../services/dashboard.service.js";

export async function getDashboardInsightsHandler(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 5;
    const insights = await getDashboardInsights(limit);
    return res.json(insights);
  } catch (error) {
    return next(error);
  }
}
