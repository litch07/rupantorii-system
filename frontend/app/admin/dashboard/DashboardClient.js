"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { useAuth } from "../../../contexts/AuthContext";

export default function DashboardClient() {
  const { logout } = useAuth();
  const [stats, setStats] = useState({ orders: 0, products: 0, lowStock: 0 });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [ordersRes, productsRes, alertsRes] = await Promise.all([
        api.get("/api/admin/orders?limit=1"),
        api.get("/api/admin/products?limit=1"),
        api.get("/api/admin/alerts?lowStock=true")
      ]);

      setStats({
        orders: ordersRes.data.total || 0,
        products: productsRes.data.total || 0,
        lowStock: alertsRes.data.items?.length || 0
      });

      setAlerts(alertsRes.data.items || []);
    };

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl text-ink">Dashboard</h1>
        <button className="btn-outline" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Orders", value: stats.orders },
          { label: "Total Products", value: stats.products },
          { label: "Low Stock", value: stats.lowStock }
        ].map((item) => (
          <div key={item.label} className="glass-card rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-pine">{item.label}</p>
            <p className="mt-3 text-3xl text-ink">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl text-ink">Low Stock Alerts</h2>
        <div className="mt-4 space-y-3 text-sm text-pine">
          {alerts.length === 0 ? (
            <p>No low stock items.</p>
          ) : (
            alerts.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span>{item.product.name} · {item.sku}</span>
                <span className="text-rose">{item.stock} left</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
