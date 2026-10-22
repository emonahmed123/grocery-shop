import { Star } from "lucide-react";

const reviews = [
  {
    name: "Esther Howard",
    date: "June 12, 2026",
    rating: 5,
    text: "Fresh and crisp, exactly as described. Delivery was on time and the packaging kept everything cold.",
  },
  {
    name: "Jacob Jones",
    date: "May 28, 2026",
    rating: 4,
    text: "Good quality and fair price. I would order again, but the bag was slightly smaller than I expected.",
  },
];

const ratingSteps = [1, 2, 3, 4, 5];

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {ratingSteps.map((step) => (
      <Star
        key={step}
        className={
          step <= rating ? "size-4 fill-brand text-brand" : "size-4 text-border"
        }
      />
    ))}
  </div>
);

// Static sample reviews until reviews come from the backend.
const ProductReviews = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="flex flex-col items-start gap-2 lg:col-span-3">
        <p className="text-4xl font-bold text-foreground">4.5</p>
        <Stars rating={5} />
        <p className="text-sm text-muted-foreground">
          Based on {reviews.length} reviews
        </p>
      </div>
      <ul className="flex flex-col divide-y lg:col-span-9">
        {reviews.map((review) => (
          <li key={review.name} className="py-5 first:pt-0">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-base font-medium text-foreground">
                {review.name}
              </p>
              <p className="text-sm text-muted-foreground">{review.date}</p>
            </div>
            <Stars rating={review.rating} />
            <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
              {review.text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductReviews;
