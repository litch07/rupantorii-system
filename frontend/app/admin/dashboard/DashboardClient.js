"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { useAuth } from "../../../contexts/AuthContext";
import Link from "next/link";

function StarIcon({ className }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.95 5.52L10 14.8l-4.95 2.63.95-5.52-4-3.9 5.53-.8L10 1.5z" />
    </svg>
  );
}

export default function DashboardClient() {
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    lowStock: 0,
    pendingQuestions: 0,
    pendingReviews: 0,
    itemsSold: 0
  });
  const [alerts, setAlerts] = useState([]);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersRes, productsRes, alertsRes, questionsRes, reviewsRes, insightsRes] = await Promise.all([
          api.get("/api/admin/orders?limit=1"),
          api.get("/api/admin/products?limit=1"),
          api.get("/api/admin/alerts?lowStock=true"),
          api.get("/api/admin/questions"),
          api.get("/api/admin/reviews"),
          api.get("/api/admin/dashboard/insights?limit=9")
        ]);

        const questions = questionsRes.data.data || [];
        const reviews = reviewsRes.data.data || [];
        const pendingQuestions = questions.filter((question) => !question.answer).length;
        const pendingReviews = reviews.filter((review) => !review.reply).length;

        setStats({
          orders: ordersRes.data.total || 0,
          products: productsRes.data.total || 0,
          lowStock: alertsRes.data.items?.length || 0,
          pendingQuestions,
          pendingReviews,
          itemsSold: insightsRes.data.totals?.itemsSold || 0
        });

        setAlerts(alertsRes.data.items || []);
        setRecentQuestions(questions.filter((question) => !question.answer).slice(0, 3));
        setTopProducts(insightsRes.data.topProducts || []);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Unable to load dashboard data.");
      }
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
      {errorMessage ? <p className="text-sm text-rose">{errorMessage}</p> : null}

      <div className="grid gap-4 md:grid-cols-6">
        {[
          { label: "Total Orders", value: stats.orders },
          { label: "Total Products", value: stats.products },
          { label: "Low Stock", value: stats.lowStock },
          { label: "Pending Questions", value: stats.pendingQuestions },
          { label: "Pending Reviews", value: stats.pendingReviews },
          { label: "Items Sold", value: stats.itemsSold }
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
                <span>{item.product.name} - {item.sku || "No variants"}</span>
                <span className="text-rose">{item.stock} left</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl text-ink">Featured Products</h2>
          <Link href="/admin/products" className="text-xs uppercase tracking-[0.3em] text-pine hover:text-rose">
            View catalog
          </Link>
        </div>
        <div className="space-y-3 text-sm text-pine">
          {topProducts.length === 0 ? (
            <p>No featured products yet.</p>
          ) : (
            topProducts.map((product) => (
              <div key={product.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-ink">{product.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-pine">
                    {product.status === "active" ? "Active" : "Hidden"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 text-rose">
                    <StarIcon className="h-4 w-4" />
                    <span className="text-sm text-ink">{product.rating.toFixed(1)}</span>
                    <span className="text-xs text-pine">({product.reviewCount})</span>
                  </div>
                  <p className="text-xs uppercase tracking-[0.3em] text-pine">{product.soldCount} sold</p>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-xs uppercase tracking-[0.3em] text-pine hover:text-rose"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl text-ink">Latest Questions</h2>
          <Link href="/admin/questions" className="text-xs uppercase tracking-[0.3em] text-pine hover:text-rose">
            View all
          </Link>
        </div>
        <div className="space-y-3 text-sm text-pine">
          {recentQuestions.length === 0 ? (
            <p>No new questions.</p>
          ) : (
            recentQuestions.map((question) => (
              <div key={question.id} className="rounded-2xl border border-mist bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-ink">{question.product?.name}</p>
                <p className="mt-2">{question.question}</p>
              </div>
            ))
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/questions" className="btn-outline">Answer Questions</Link>
          <Link href="/admin/reviews" className="btn-outline">Reply to Reviews</Link>
        </div>
      </div>
    </div>
  );
}

