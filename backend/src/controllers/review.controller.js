import {
  createReview,
  listProductReviews,
  listReviewsForAdmin,
  replyToReview
} from "../services/review.service.js";

export async function listReviews(req, res, next) {
  try {
    const reviews = await listProductReviews(req.params.id);
    return res.json({ data: reviews });
  } catch (error) {
    return next(error);
  }
}

export async function createReviewHandler(req, res, next) {
  try {
    const review = await createReview(req.params.id, req.user.sub, req.body);
    return res.status(201).json(review);
  } catch (error) {
    return next(error);
  }
}

export async function listReviewsAdmin(req, res, next) {
  try {
    const reviews = await listReviewsForAdmin();
    return res.json({ data: reviews });
  } catch (error) {
    return next(error);
  }
}

export async function replyReviewHandler(req, res, next) {
  try {
    const review = await replyToReview(req.params.id, req.body.reply);
    return res.json(review);
  } catch (error) {
    return next(error);
  }
}
