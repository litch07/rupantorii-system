"use client";

import { useState } from "react";
import api from "../../lib/api";
import { formatPrice, getErrorMessage } from "../../lib/helpers";

const statusSteps = ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"];

export default function TrackOrderClient() {
  const [form, setForm] = useState({ orderNumber: "", phone: "" });
  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await api.get("/api/orders/track", {
        params: { orderNumber: form.orderNumber.trim(), phone: form.phone.trim() }
      });
      setOrder(response.data);
    } catch (error) {
      setOrder(null);
      setErrorMessage(getErrorMessage(error, "Unable to find this order."));
    } finally {
      setLoading(false);
    }
  };

  const activeIndex = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <section className="section-pad space-y-8 py-12">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-pine">Track Order</p>
        <h1 className="text-4xl text-ink">Check your delivery status</h1>
        <p className="text-sm text-pine">
          Enter your order number and phone number to view your delivery timeline.
        </p>
      </div>

      <form className="grid gap-4 rounded-3xl border border-mist bg-white/70 p-6 md:grid-cols-3" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm text-pine md:col-span-1">
          <span className="uppercase tracking-[0.2em]">Order Number</span>
          <input
            name="orderNumber"
            value={form.orderNumber}
            onChange={handleChange}
            className="rounded-2xl border border-mist bg-white/80 px-4 py-3"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-pine md:col-span-1">
          <span className="uppercase tracking-[0.2em]">Phone</span>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="rounded-2xl border border-mist bg-white/80 px-4 py-3"
          />
        </label>
        <button type="submit" className="btn-primary md:col-span-1" disabled={loading}>
          {loading ? "Searching..." : "Track Order"}
        </button>
      </form>

      {errorMessage ? <p className="text-sm text-rose">{errorMessage}</p> : null}

      {order ? (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-pine">Order {order.orderNumber}</p>
                <p className="text-sm text-pine">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.3em] text-pine">Total</p>
                <p className="text-lg text-rose">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {statusSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 text-sm">
                  <span className={`h-2 w-2 rounded-full ${index <= activeIndex ? "bg-rose" : "bg-mist"}`} />
                  <span className={index <= activeIndex ? "text-ink" : "text-pine"}>
                    {step.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
