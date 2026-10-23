import "server-only";

import { createApiClient, httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/api.types";
import type { ProductReview } from "@/types/review.types";

const REVIEW_ENDPOINTS = {
  create: "/reviews",
  forProduct: (productId: string) => `/reviews/${encodeURIComponent(productId)}`,
  eligibility: (productId: string) => `/reviews/${encodeURIComponent(productId)}/eligibility`,
};

type BackendReview = {
  _id: string;
  userName: string;
  rating?: number;
  review: string;
  createdAt?: string;
};

const toReview = (review: BackendReview): ProductReview => ({
  id: review._id,
  userName: review.userName,
  rating: review.rating,
  review: review.review,
  createdAt: review.createdAt,
});

/** A product's reviews, newest first. Public, so no cookie is sent. */
export async function getProductReviews(productId: string) {
  const response = await createApiClient().get<ApiResponse<BackendReview[] | null>>(
    REVIEW_ENDPOINTS.forProduct(productId),
  );
  return (response.data.data ?? []).map(toReview);
}

/** Asks the backend whether the logged-in customer got this product and has not reviewed it yet. */
export async function getReviewEligibility(productId: string) {
  const response = await httpClient.get<{ hasPurchased: boolean; hasReviewed: boolean; canReview: boolean }>(
    REVIEW_ENDPOINTS.eligibility(productId),
  );
  return response.data;
}

export async function createReview(payload: { productId: string; rating: number; review: string }) {
  await httpClient.post(REVIEW_ENDPOINTS.create, payload);
}
