"use client";

import { useEffect, useState } from "react";
import customerApi from "../../../lib/customerApi";
import { formatPrice, getErrorMessage } from "../../../lib/helpers";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

function formatStatus(status) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function OrdersClient() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const loadOrders = async () => {
    try {
      const response = await customerApi.get("/api/account/orders");
      setOrders(response.data.data || []);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to load orders."));
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-ink">My Orders</h1>
      {errorMessage ? <p className="text-sm text-rose">{errorMessage}</p> : null}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-mist bg-white/70 p-6 text-sm text-pine">
            No orders yet.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="glass-card rounded-3xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-pine">Order {order.orderNumber}</p>
                  <p className="text-sm text-pine">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm uppercase tracking-[0.3em] text-ink">{formatStatus(order.status)}</p>
                  <p className="text-lg text-rose">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>
              <button
                className="mt-4 text-xs uppercase tracking-[0.3em] text-pine hover:text-rose"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                {expandedId === order.id ? "Hide details" : "View details"}
              </button>
              {expandedId === order.id ? (
                <div className="mt-4 space-y-2 text-sm text-pine">
                  {order.cancelReason ? <p>Cancel reason: {order.cancelReason}</p> : null}
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center justify-between gap-2">
                      <span>
                        {item.product.name}
                        {item.variant?.sku ? ` (${item.variant.sku})` : ""}
                      </span>
                      <span>
                        {item.quantity} x {formatPrice(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
