import { getSalesReport } from "../services/report.service.js";

export async function getSalesReportHandler(req, res, next) {
  try {
    const range = req.query.range || "overall";
    const report = await getSalesReport(range);
    return res.json(report);
  } catch (error) {
    return next(error);
  }
}

export async function exportSalesReportHandler(req, res, next) {
  try {
    const range = req.query.range || "overall";
    const report = await getSalesReport(range);
    const rows = [["Period", "Orders", "Revenue"]];
    if (report.series && report.series.length > 0) {
      report.series.forEach((row) => {
        rows.push([row.period, row.orders, row.revenue]);
      });
    } else {
      rows.push(["overall", report.totals.orders, report.totals.revenue]);
    }
    const csv = rows.map((row) => row.join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=sales-report-${range}.csv`);
    return res.send(csv);
  } catch (error) {
    return next(error);
  }
}
