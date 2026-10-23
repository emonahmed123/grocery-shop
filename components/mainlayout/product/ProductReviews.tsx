import ReviewForm from "@/components/mainlayout/product/ReviewForm";
import Stars from "@/components/mainlayout/product/Stars";
import { formatDate } from "@/lib/format";
import type { ProductReview } from "@/types/review.types";

type ProductReviewsProps = {
  productId: string;
  reviews: ProductReview[];
  averageRating: number;
  ratingCount: number;
};

/** Reviews come with the page; the form checks on its own whether this visitor may write one. */
const ProductReviews = ({ productId, reviews, averageRating, ratingCount }: ProductReviewsProps) => {
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="flex flex-col items-start gap-2 lg:col-span-4">
        <p className="text-4xl font-bold text-foreground">{ratingCount > 0 ? averageRating.toFixed(1) : "–"}</p>
        <Stars rating={averageRating} />
        <p className="text-sm text-muted-foreground">
          {ratingCount > 0 ? `Based on ${ratingCount} ${ratingCount === 1 ? "rating" : "ratings"}` : "No ratings yet"}
        </p>
        <div className="mt-6 w-full">
          <ReviewForm productId={productId} />
        </div>
      </div>

      <div className="lg:col-span-8">
        {reviews.length === 0 ? (
          <p className="rounded-md border p-8 text-center text-sm text-muted-foreground">
            No reviews yet. Customers who receive this product can review it.
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {reviews.map((review) => (
              <li key={review.id} className="py-5 first:pt-0">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-base font-medium text-foreground">{review.userName}</p>
                  {review.createdAt && <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>}
                </div>
                {review.rating !== undefined && <Stars rating={review.rating} />}
                <p className="mt-3 text-sm leading-7 whitespace-pre-line text-muted-foreground md:text-base">
                  {review.review}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
