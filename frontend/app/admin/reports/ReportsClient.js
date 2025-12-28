"use client";

import { useState } from "react";
import api from "../../../lib/api";
import { formatPrice, getErrorMessage } from "../../../lib/helpers";

const RANGE_OPTIONS = [
  { value: "daily", label: "Daily (Last 14 Days)" },
  { value: "weekly", label: "Weekly (Last 12 Weeks)" },
  { value: "yearly", label: "Yearly" },
  { value: "overall", label: "Overall Summary" }
];

export default function ReportsClient() {
  const [report, setReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRange, setSelectedRange] = useState("");
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    if (!selectedRange) {
      setErrorMessage("Select a report range first.");
      return;
    }
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/reports/sales?range=${selectedRange}`);
      setReport(response.data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to load sales report."));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedRange) {
      setErrorMessage("Select a report range first.");
      return;
    }
    try {
      setErrorMessage("");
      const response = await api.get(`/api/admin/reports/sales/export?range=${selectedRange}`, {
        responseType: "blob"
      });
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sales-report-${selectedRange}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to download report."));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl text-ink">Sales Report</h1>
      </div>
      {errorMessage ? <p className="text-sm text-rose">{errorMessage}</p> : null}
      <p className="text-sm text-pine">Select a report range to generate and download.</p>

      <div className="glass-card rounded-3xl p-6 space-y-4">
        <label className="flex flex-col gap-2 text-sm text-pine">
          <span className="uppercase tracking-[0.2em]">Report Range</span>
          <select
            value={selectedRange}
            onChange={(event) => setSelectedRange(event.target.value)}
            className="rounded-2xl border border-mist bg-white/80 px-4 py-3"
          >
            <option value="">Select range</option>
            {RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary" onClick={loadReport} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </button>
          <button className="btn-outline" onClick={handleDownload} disabled={!selectedRange}>
            Download CSV
          </button>
        </div>
      </div>

      {report ? (
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-pine">Summary</p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-mist bg-white/80 p-4 text-sm text-pine">
              <p className="text-xs uppercase tracking-[0.3em] text-ink">Orders</p>
              <p className="mt-2 text-2xl text-ink">{report.totals.orders}</p>
            </div>
            <div className="rounded-2xl border border-mist bg-white/80 p-4 text-sm text-pine">
              <p className="text-xs uppercase tracking-[0.3em] text-ink">Revenue</p>
              <p className="mt-2 text-2xl text-rose">{formatPrice(report.totals.revenue)}</p>
            </div>
            <div className="rounded-2xl border border-mist bg-white/80 p-4 text-sm text-pine">
              <p className="text-xs uppercase tracking-[0.3em] text-ink">Statuses Tracked</p>
              <p className="mt-2 text-2xl text-ink">{report.byStatus.length}</p>
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-pine">Status Breakdown</p>
          <div className="grid gap-3 md:grid-cols-3">
            {report.byStatus.map((row) => (
              <div key={row.status} className="rounded-2xl border border-mist bg-white/80 p-4 text-sm text-pine">
                <p className="text-xs uppercase tracking-[0.3em] text-ink">{row.status}</p>
                <p>Orders: {row.orders}</p>
                <p>Revenue: {formatPrice(row.revenue)}</p>
              </div>
            ))}
          </div>
          {report.series && report.series.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-mist bg-white/80 p-4 text-sm text-pine">
              <p className="text-xs uppercase tracking-[0.3em] text-ink">Report Series</p>
              <div className="mt-2 space-y-2">
                {report.series.map((row) => (
                  <div key={row.period} className="flex items-center justify-between">
                    <span>{new Date(row.period).toLocaleDateString()}</span>
                    <span>{row.orders} orders</span>
                    <span>{formatPrice(row.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
