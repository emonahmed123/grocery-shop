"use server";

import { getMeAction } from "@/actions/auth.actions";
import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { isAdmin } from "@/lib/roles";
import { createReview, getReviewEligibility } from "@/services/review.services";
import type { ApiResult } from "@/types/api.types";
import type { ReviewEligibility } from "@/types/review.types";
import { type IReviewFormValues, reviewZodSchema } from "@/zod/review.validation";

const OBJECT_ID = /^[a-f\d]{24}$/i;

export async function getReviewEligibilityAction(productId: string): Promise<ApiResult<ReviewEligibility>> {
  if (!OBJECT_ID.test(productId)) return { success: false, message: "Unknown product" };

  try {
    const user = await getMeAction();
    if (!user) return { success: true, message: "Not logged in", data: "guest" };
    if (isAdmin(user)) return { success: true, message: "Admins do not review", data: "admin" };

    const { canReview, hasReviewed } = await getReviewEligibility(productId);
    const status: ReviewEligibility = canReview ? "can-review" : hasReviewed ? "reviewed" : "not-purchased";
    return { success: true, message: "Checked", data: status };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "Could not check your orders") };
  }
}

export async function createReviewAction(productId: string, values: IReviewFormValues): Promise<ApiResult<null>> {
  // The browser can be bypassed, so validate again on the server.
  const parsed = reviewZodSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Please check your review" };
  }
  if (!OBJECT_ID.test(productId)) return { success: false, message: "Unknown product" };

  try {
    await createReview({ productId, ...parsed.data });
    return { success: true, message: "Thanks! Your review is live.", data: null };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "Could not save your review") };
  }
}
