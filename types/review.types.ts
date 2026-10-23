export interface ProductReview {
  id: string;
  userName: string;
  /** 1 to 5; older reviews have no rating. */
  rating?: number;
  review: string;
  createdAt?: string;
}

/** Whether the current visitor may review a product, and why not. */
export type ReviewEligibility = "guest" | "admin" | "not-purchased" | "reviewed" | "can-review";
