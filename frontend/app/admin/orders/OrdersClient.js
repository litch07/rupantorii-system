"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { formatPrice } from "../../../lib/helpers";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function OrdersClient() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const response = await api.get("/api/admin/orders");
    setOrders(response.data.data || []);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/api/admin/orders/${id}/status`, { status });
    loadOrders();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-ink">Orders</h1>
      <div className="overflow-hidden rounded-3xl border border-mist bg-white/80">
        <table className="w-full text-left text-sm">
          <thead className="bg-mist text-xs uppercase tracking-[0.3em] text-pine">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-mist">
                <td className="px-4 py-4 font-medium text-ink">{order.orderNumber}</td>
                <td className="px-4 py-4 text-pine">{order.customerName}</td>
                <td className="px-4 py-4 text-rose">{formatPrice(order.totalAmount)}</td>
                <td className="px-4 py-4">
                  <select
                    value={order.status}
                    onChange={(event) => updateStatus(order.id, event.target.value)}
                    className="rounded-full border border-mist bg-white/80 px-3 py-2 text-xs uppercase tracking-[0.2em] text-pine"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
