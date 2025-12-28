"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import api from "../../../lib/api";
import { formatPrice, getErrorMessage } from "../../../lib/helpers";

const STATUS_FILTERS = ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned", "all"];

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

function formatStatusLabel(status) {
  if (!status) return "";
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function OrdersClient() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [expanded, setExpanded] = useState({ id: null, view: "details" });
  const [cancelReasons, setCancelReasons] = useState({});
  const [cancelError, setCancelError] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("q", search.trim());
    }
    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    }
    return params.toString() ? `?${params.toString()}` : "";
  }, [search, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/admin/orders${queryString}`);
      setOrders(response.data.data || []);
      setActionError("");
    } catch (error) {
      setActionError(getErrorMessage(error, "Unable to load orders."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [queryString]);

  const updateStatus = async (id, status, cancelReason) => {
    try {
      const payload = { status };
      if (cancelReason) {
        payload.cancelReason = cancelReason;
      }
      await api.patch(`/api/admin/orders/${id}/status`, payload);
      setExpanded({ id: null, view: "details" });
      setCancelError((prev) => ({ ...prev, [id]: "" }));
      setActionError("");
      loadOrders();
    } catch (error) {
      setActionError(getErrorMessage(error, "Unable to update order status."));
    }
  };

  const toggleView = (orderId, view) => {
    if (expanded.id === orderId && expanded.view === view) {
      setExpanded({ id: null, view: "details" });
      return;
    }

    setExpanded({ id: orderId, view });
  };

  const handleCancel = async (orderId) => {
    const reason = (cancelReasons[orderId] || "").trim();
    if (!reason) {
      setCancelError((prev) => ({ ...prev, [orderId]: "Cancellation reason is required." }));
      return;
    }
    await updateStatus(orderId, "cancelled", reason);
  };

  const handleDownloadReceipt = async (order) => {
    try {
      const response = await api.get(`/api/admin/orders/${order.id}/receipt`, {
        responseType: "blob"
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `order-${order.orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setActionError("");
    } catch (error) {
      setActionError(getErrorMessage(error, "Unable to download receipt."));
    }
  };

  const renderActions = (order) => {
    const actions = [];

    actions.push(
      <button
        key="details"
        className="text-xs uppercase tracking-[0.2em] text-pine hover:text-rose"
        onClick={() => toggleView(order.id, "details")}
      >
        Details
      </button>
    );

    if (order.status === "pending") {
      actions.push(
        <button
          key="confirm"
          className="btn-outline"
          onClick={() => updateStatus(order.id, "confirmed")}
        >
          Confirm
        </button>
      );
      actions.push(
        <button
          key="cancel"
          className="btn-outline"
          onClick={() => toggleView(order.id, "cancel")}
        >
          Cancel
        </button>
      );
    }

    if (order.status === "confirmed") {
      actions.push(
        <button
          key="ship"
          className="btn-outline"
          onClick={() => updateStatus(order.id, "shipped")}
        >
          Mark Shipped
        </button>
      );
      actions.push(
        <button
          key="cancel"
          className="btn-outline"
          onClick={() => toggleView(order.id, "cancel")}
        >
          Cancel
        </button>
      );
    }

    if (order.status === "shipped") {
      actions.push(
        <button
          key="deliver"
          className="btn-outline"
          onClick={() => updateStatus(order.id, "delivered")}
        >
          Mark Delivered
        </button>
      );
      actions.push(
        <button
          key="cancel"
          className="btn-outline"
          onClick={() => toggleView(order.id, "cancel")}
        >
          Cancel
        </button>
      );
    }

    if (order.status === "delivered") {
      actions.push(
        <button
          key="return"
          className="btn-outline"
          onClick={() => updateStatus(order.id, "returned")}
        >
          Mark Returned
        </button>
      );
      actions.push(
        <button
          key="cancel"
          className="btn-outline"
          onClick={() => toggleView(order.id, "cancel")}
        >
          Cancel
        </button>
      );
    }

    return actions;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl text-ink">Orders</h1>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by order number or ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="rounded-full border border-mist bg-white/80 px-4 py-2 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-full border border-mist bg-white/80 px-4 py-2 text-sm"
          >
            {STATUS_FILTERS.map((status) => (
              <option key={status} value={status}>
                {formatStatusLabel(status)}
              </option>
            ))}
          </select>
          <button className="btn-outline" onClick={loadOrders}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>
      {actionError ? <p className="text-sm text-rose">{actionError}</p> : null}

      <div className="overflow-hidden rounded-3xl border border-mist bg-white/80">
        <table className="w-full text-left text-sm">
          <thead className="bg-mist text-xs uppercase tracking-[0.3em] text-pine">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <Fragment key={order.id}>
                <tr className="border-t border-mist">
                  <td className="px-4 py-4 font-medium text-ink">{order.orderNumber}</td>
                  <td className="px-4 py-4 text-pine">{order.customerName}</td>
                  <td className="px-4 py-4 text-rose">{formatPrice(order.totalAmount)}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full border border-mist bg-white/80 px-3 py-2 text-xs uppercase tracking-[0.2em] text-pine">
                      {formatStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      {renderActions(order)}
                    </div>
                  </td>
                </tr>
                {expanded.id === order.id ? (
                  <tr className="border-t border-mist bg-white/70">
                    <td colSpan="5" className="px-4 py-4">
                      {expanded.view === "cancel" ? (
                        <div className="space-y-4 text-sm text-pine">
                          <p className="text-xs uppercase tracking-[0.3em] text-ink">Cancel Order</p>
                          <textarea
                            value={cancelReasons[order.id] || ""}
                            onChange={(event) =>
                              setCancelReasons((prev) => ({ ...prev, [order.id]: event.target.value }))
                            }
                            placeholder="Reason for cancellation"
                            className="min-h-[120px] w-full rounded-2xl border border-mist bg-white/80 px-4 py-3"
                          />
                          {cancelError[order.id] ? <p className="text-xs text-rose">{cancelError[order.id]}</p> : null}
                          <div className="flex flex-wrap gap-3">
                            <button className="btn-primary" onClick={() => handleCancel(order.id)}>
                              Confirm Cancel
                            </button>
                            <button
                              className="btn-outline"
                              onClick={() => setExpanded({ id: null, view: "details" })}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 text-sm text-pine">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <p className="text-xs uppercase tracking-[0.3em] text-ink">Customer</p>
                              <p>{order.customerName}</p>
                              <p>{order.customerPhone}</p>
                              <p>{order.address}</p>
                              <p>{order.city}</p>
                              {order.notes ? <p>Notes: {order.notes}</p> : null}
                              {order.cancelReason ? <p>Cancel reason: {order.cancelReason}</p> : null}
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs uppercase tracking-[0.3em] text-ink">Order</p>
                              <p>Order ID: {order.id}</p>
                              <p>Date: {formatDate(order.createdAt)}</p>
                              <p>Status: {formatStatusLabel(order.status)}</p>
                              <p>Total: {formatPrice(order.totalAmount)}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-ink">Items</p>
                            <div className="mt-2 space-y-2">
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
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button className="btn-outline" onClick={() => handleDownloadReceipt(order)}>
                              Download Receipt
                            </button>
                            {order.status !== "cancelled" && order.status !== "returned" ? (
                              <button className="btn-outline" onClick={() => toggleView(order.id, "cancel")}>
                                Cancel Order
                              </button>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
