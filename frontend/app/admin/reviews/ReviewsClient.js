"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import { getErrorMessage } from "../../../lib/helpers";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

export default function ReviewsClient() {
  const [reviews, setReviews] = useState([]);
  const [replies, setReplies] = useState({});
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState("pending");

  const loadReviews = async () => {
    try {
      const response = await api.get("/api/admin/reviews");
      setReviews(response.data.data || []);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to load reviews."));
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const pendingReviews = useMemo(
    () => reviews.filter((review) => !review.reply),
    [reviews]
  );
  const repliedReviews = useMemo(
    () => reviews.filter((review) => review.reply),
    [reviews]
  );
  const visibleReviews = useMemo(() => {
    if (filter === "replied") return repliedReviews;
    if (filter === "all") return reviews;
    return pendingReviews;
  }, [filter, pendingReviews, repliedReviews, reviews]);

  const handleReply = async (id) => {
    const reply = (replies[id] || "").trim();
    if (!reply) {
      setErrorMessage("Reply cannot be empty.");
      return;
    }
    try {
      setErrorMessage("");
      setMessage("");
      await api.patch(`/api/admin/reviews/${id}/reply`, { reply });
      setMessage("Reply saved.");
      loadReviews();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to save reply."));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl text-ink">Product Reviews</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-pine">
            {[
              { key: "pending", label: `Pending (${pendingReviews.length})` },
              { key: "replied", label: `Replied (${repliedReviews.length})` },
              { key: "all", label: `All (${reviews.length})` }
            ].map((item) => (
              <button
                key={item.key}
                className={filter === item.key ? "btn-primary" : "btn-outline"}
                onClick={() => setFilter(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button className="btn-outline" onClick={loadReviews}>
            Refresh
          </button>
        </div>
      </div>
      {message ? <p className="text-xs uppercase tracking-[0.3em] text-pine">{message}</p> : null}
      {errorMessage ? <p className="text-sm text-rose">{errorMessage}</p> : null}

      <div className="space-y-4">
        {visibleReviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-mist bg-white/70 p-6 text-sm text-pine">
            No reviews to show.
          </div>
        ) : (
          visibleReviews.map((review) => (
            <div key={review.id} className="glass-card rounded-3xl p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-pine">Product</p>
                  <p className="text-sm text-ink">{review.product?.name}</p>
                  {review.product?.id ? (
                    <Link
                      href={`/admin/products/${review.product.id}/edit`}
                      className="text-xs uppercase tracking-[0.3em] text-pine hover:text-rose"
                    >
                      View product details
                    </Link>
                  ) : null}
                </div>
                <div className="text-right text-xs text-pine">
                  <p>{review.user?.name || "Customer"}</p>
                  <p>{review.user?.email}</p>
                  <p>{formatDate(review.createdAt)}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-mist bg-white/80 p-4 text-sm text-pine">
                <p className="text-xs uppercase tracking-[0.3em] text-ink">
                  Rating: {review.rating} / 5 {review.verifiedPurchase ? "(Verified)" : ""}
                </p>
                {review.title ? <p className="mt-2 text-ink">{review.title}</p> : null}
                <p className="mt-2">{review.comment}</p>
              </div>
              {review.reply ? (
                <div className="rounded-2xl border border-mist bg-white/80 p-4 text-sm text-ink">
                  <p className="text-xs uppercase tracking-[0.3em] text-pine">Reply</p>
                  <p>{review.reply}</p>
                  {review.repliedAt ? (
                    <p className="mt-2 text-xs text-pine">
                      Replied on {formatDate(review.repliedAt)}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={replies[review.id] || ""}
                    onChange={(event) => setReplies((prev) => ({ ...prev, [review.id]: event.target.value }))}
                    placeholder="Write a reply to this review..."
                    className="min-h-[110px] w-full rounded-2xl border border-mist bg-white/80 px-4 py-3 text-sm text-ink"
                  />
                  <button className="btn-primary" onClick={() => handleReply(review.id)}>
                    Send Reply
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
