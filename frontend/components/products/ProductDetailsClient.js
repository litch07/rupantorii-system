"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { formatPrice, getDiscountMeta, getErrorMessage, getServerApiUrl } from "../../lib/helpers";
import VariantSelector from "./VariantSelector";
import customerApi from "../../lib/customerApi";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";

export default function ProductDetailsClient({ product }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useCustomerAuth();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.find((variant) => variant.stock > 0) || product.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [reviews, setReviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [questionForm, setQuestionForm] = useState({ question: "" });
  const [reviewMessage, setReviewMessage] = useState("");
  const [questionMessage, setQuestionMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [questionError, setQuestionError] = useState("");

  const rating = Number(product.rating || 0);
  const reviewCount = product.reviewCount || 0;
  const basePrice = selectedVariant?.price ?? product.basePrice;
  const discountMeta = getDiscountMeta(basePrice, product.discountType, product.discountValue);
  const price = discountMeta.discountedPrice;
  const variantList = product.variants || [];
  const hasVariants = variantList.length > 0;
  const totalStock = hasVariants
    ? variantList.reduce((sum, variant) => sum + (variant.stock || 0), 0)
    : product.stock || 0;
  const isOutOfStock = product.status === "out_of_stock" || totalStock <= 0;
  const lowStock = totalStock > 0 && totalStock <= 10;
  const variantStock = selectedVariant ? selectedVariant.stock : null;
  const cannotPurchase = isOutOfStock || (variantStock !== null && variantStock <= 0);
  const variantLabel = useMemo(() => {
    if (!selectedVariant) return null;
    return [selectedVariant.size, selectedVariant.color, selectedVariant.material]
      .filter(Boolean)
      .join(" - ");
  }, [selectedVariant]);

  const handleAddToCart = () => {
    if (cannotPurchase) {
      setFeedback("This product is currently out of stock.");
      return;
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      name: product.name,
      variantLabel,
      price,
      quantity,
      image: product.primaryImage
    });
    setFeedback("Added to cart.");
  };

  const loadEngagement = async () => {
    try {
      const [reviewsRes, questionsRes] = await Promise.all([
        customerApi.get(`/api/products/${product.id}/reviews`),
        customerApi.get(`/api/products/${product.id}/questions`)
      ]);
      setReviews(reviewsRes.data.data || []);
      setQuestions(questionsRes.data.data || []);
    } catch (error) {
      setReviewError(getErrorMessage(error, "Unable to load reviews."));
      setQuestionError(getErrorMessage(error, "Unable to load questions."));
    }
  };

  useEffect(() => {
    loadEngagement();
  }, [product.id]);

  const submitReview = async (event) => {
    event.preventDefault();
    try {
      setReviewError("");
      setReviewMessage("");
      await customerApi.post(`/api/products/${product.id}/reviews`, reviewForm);
      setReviewMessage("Thanks for sharing your review.");
      setReviewForm({ rating: 5, title: "", comment: "" });
      loadEngagement();
    } catch (error) {
      setReviewError(getErrorMessage(error, "Unable to submit review."));
    }
  };

  const submitQuestion = async (event) => {
    event.preventDefault();
    try {
      setQuestionError("");
      setQuestionMessage("");
      await customerApi.post(`/api/products/${product.id}/questions`, questionForm);
      setQuestionMessage("Question sent to the admin.");
      setQuestionForm({ question: "" });
      loadEngagement();
    } catch (error) {
      setQuestionError(getErrorMessage(error, "Unable to submit question."));
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-pine">{product.category?.name}</p>
          <h1 className="text-3xl text-ink">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-pine">
            {reviewCount > 0 ? (
              <>
                <span className="text-rose">*</span>
                <span className="text-ink">{rating.toFixed(1)}</span>
                <span>({reviewCount} reviews)</span>
              </>
            ) : (
              <span>No reviews yet</span>
            )}
          </div>
          <p className="mt-3 text-sm text-pine">{product.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-2xl text-rose">{formatPrice(price)}</span>
          {discountMeta.isDiscounted ? (
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-pine">
              <span className="line-through">{formatPrice(basePrice)}</span>
              <span className="text-rose">{discountMeta.discountPercent}% off</span>
            </div>
          ) : null}
          {hasVariants ? (
            selectedVariant && selectedVariant.stock <= 10 ? (
              <span className="text-xs uppercase tracking-[0.3em] text-pine">
                Stock: {selectedVariant.stock}
              </span>
            ) : null
          ) : totalStock <= 10 ? (
            <span className="text-xs uppercase tracking-[0.3em] text-pine">
              Stock: {totalStock}
            </span>
          ) : null}
          {isOutOfStock ? (
            <span className="text-xs uppercase tracking-[0.3em] text-rose">Out of stock</span>
          ) : lowStock ? (
            <span className="text-xs uppercase tracking-[0.3em] text-pine">Only {totalStock} left</span>
          ) : null}
        </div>

        <VariantSelector
          variants={product.variants}
          selectedId={selectedVariant?.id}
          onChange={setSelectedVariant}
        />

        <div className="flex items-center gap-4">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="w-20 rounded-full border border-mist bg-white/80 px-4 py-3 text-center text-sm"
          />
          <button className="btn-primary" onClick={handleAddToCart} disabled={cannotPurchase}>
            {cannotPurchase ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
        {feedback ? <p className="text-xs uppercase tracking-[0.3em] text-pine">{feedback}</p> : null}
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl text-ink">Questions</h2>
          {isAuthenticated ? (
            <p className="text-xs uppercase tracking-[0.3em] text-pine">Ask about materials, fit, or care</p>
          ) : (
            <p className="text-xs uppercase tracking-[0.3em] text-pine">Sign in to ask a question</p>
          )}
        </div>
        {questionError ? <p className="text-sm text-rose">{questionError}</p> : null}
        <div className="space-y-3">
          {questions.length === 0 ? (
            <p className="text-sm text-pine">No questions yet.</p>
          ) : (
            questions.map((item) => (
              <div key={item.id} className="rounded-3xl border border-mist bg-white/80 p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-mist bg-white">
                    {item.user?.avatarUrl ? (
                      <img
                        src={`${getServerApiUrl()}${item.user.avatarUrl}`}
                        alt={item.user?.name || "Customer"}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-sm text-ink">{item.user?.name || "Customer"}</p>
                    <p className="text-xs text-pine">Asked on {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-pine">{item.question}</p>
                {item.answer ? (
                  <div className="mt-4 rounded-2xl border border-mist bg-white/70 p-4 text-sm text-ink">
                    <p className="text-xs uppercase tracking-[0.3em] text-pine">Admin Reply</p>
                    <p className="mt-2">{item.answer}</p>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
        {isAuthenticated ? (
          <form onSubmit={submitQuestion} className="space-y-3 rounded-3xl border border-mist bg-white/70 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-pine">Ask a question</p>
            <textarea
              value={questionForm.question}
              onChange={(event) => setQuestionForm({ question: event.target.value })}
              placeholder="Write your question for the Rupantorii team..."
              className="min-h-[120px] w-full rounded-2xl border border-mist bg-white/80 px-4 py-3 text-sm text-ink"
            />
            {questionMessage ? <p className="text-xs uppercase tracking-[0.3em] text-pine">{questionMessage}</p> : null}
            <button type="submit" className="btn-primary">Submit Question</button>
          </form>
        ) : null}
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl text-ink">Reviews</h2>
          {isAuthenticated ? (
            <p className="text-xs uppercase tracking-[0.3em] text-pine">Verified buyers only</p>
          ) : (
            <p className="text-xs uppercase tracking-[0.3em] text-pine">Sign in to review</p>
          )}
        </div>
        {reviewError ? <p className="text-sm text-rose">{reviewError}</p> : null}
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-sm text-pine">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="rounded-3xl border border-mist bg-white/80 p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-mist bg-white">
                    {review.user?.avatarUrl ? (
                      <img
                        src={`${getServerApiUrl()}${review.user.avatarUrl}`}
                        alt={review.user?.name || "Customer"}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-sm text-ink">{review.user?.name || "Customer"}</p>
                    <p className="text-xs text-pine">
                      {review.rating} / 5 {review.verifiedPurchase ? "Verified" : ""}
                    </p>
                  </div>
                </div>
                {review.title ? <p className="mt-3 text-sm text-ink">{review.title}</p> : null}
                <p className="mt-2 text-sm text-pine">{review.comment}</p>
                {review.reply ? (
                  <div className="mt-4 rounded-2xl border border-mist bg-white/70 p-4 text-sm text-ink">
                    <p className="text-xs uppercase tracking-[0.3em] text-pine">Admin Reply</p>
                    <p className="mt-2">{review.reply}</p>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
        {isAuthenticated ? (
          <form onSubmit={submitReview} className="space-y-3 rounded-3xl border border-mist bg-white/70 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-pine">Share your review</p>
            <label className="flex flex-col gap-2 text-sm text-pine">
              <span className="uppercase tracking-[0.2em]">Rating</span>
              <select
                value={reviewForm.rating}
                onChange={(event) =>
                  setReviewForm((prev) => ({ ...prev, rating: Number(event.target.value) }))
                }
                className="rounded-2xl border border-mist bg-white/80 px-4 py-3"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </label>
            <input
              value={reviewForm.title}
              onChange={(event) => setReviewForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Review title (optional)"
              className="w-full rounded-2xl border border-mist bg-white/80 px-4 py-3 text-sm"
            />
            <textarea
              value={reviewForm.comment}
              onChange={(event) => setReviewForm((prev) => ({ ...prev, comment: event.target.value }))}
              placeholder="Tell us about the product..."
              className="min-h-[120px] w-full rounded-2xl border border-mist bg-white/80 px-4 py-3 text-sm"
            />
            {reviewMessage ? <p className="text-xs uppercase tracking-[0.3em] text-pine">{reviewMessage}</p> : null}
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

