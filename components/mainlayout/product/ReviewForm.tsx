"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { createReviewAction, getReviewEligibilityAction } from "@/actions/review.actions";
import { getFieldError } from "@/components/form/AppField";
import AppSubmitButton from "@/components/form/AppSubmitButton";
import AppTextareaField from "@/components/form/AppTextareaField";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { unwrapResult } from "@/queries/unwrapResult";
import { type IReviewFormValues, reviewZodSchema } from "@/zod/review.validation";

const STARS = [1, 2, 3, 4, 5];

const reviewKeys = {
  eligibility: (productId: string, userId?: string) => ["reviews", "eligibility", productId, userId] as const,
};

const Note = ({ children }: { children: React.ReactNode }) => (
  <p className="rounded-md bg-fill-thumbnail px-4 py-3 text-sm text-muted-foreground">{children}</p>
);

type StarPickerProps = {
  value: number;
  onChange: (rating: number) => void;
  onBlur: () => void;
};

/** Stars as a radio group, so keyboards and screen readers can pick a rating. */
const StarPicker = ({ value, onChange, onBlur }: StarPickerProps) => (
  <div role="radiogroup" aria-label="Your rating" className="flex gap-1" onBlur={onBlur}>
    {STARS.map((step) => (
      <button
        key={step}
        type="button"
        role="radio"
        aria-checked={value === step}
        aria-label={`${step} ${step === 1 ? "star" : "stars"}`}
        onClick={() => onChange(step)}
        className="rounded-sm p-0.5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <Star
          aria-hidden="true"
          className={cn("size-7 transition-colors", step <= value ? "fill-brand text-brand" : "text-border")}
        />
      </button>
    ))}
  </div>
);

const WriteReview = ({ productId, onDone }: { productId: string; onDone: () => void }) => {
  const save = useMutation({
    mutationFn: (values: IReviewFormValues) => unwrapResult(createReviewAction(productId, values)),
    onSuccess: () => {
      toast.success("Thanks! Your review is live.");
      onDone();
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useForm({
    defaultValues: { rating: 0, review: "" } satisfies IReviewFormValues,
    validators: { onSubmit: reviewZodSchema },
    onSubmit: ({ value }) => save.mutate(value),
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <h3 className="text-base font-semibold text-foreground">Write a review</h3>
      <form.Field name="rating">
        {(field) => {
          const error = getFieldError(field);
          return (
            <div className="flex flex-col gap-1.5">
              <StarPicker value={field.state.value} onChange={field.handleChange} onBlur={field.handleBlur} />
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>
      <form.Field name="review">
        {(field) => <AppTextareaField field={field} label="Your review" placeholder="How was the product?" />}
      </form.Field>
      <AppSubmitButton isPending={save.isPending} pendingLabel="Posting...">
        Post Review
      </AppSubmitButton>
    </form>
  );
};

/** Shows the form only to customers who received this product and have not reviewed it yet. */
const ReviewForm = ({ productId }: { productId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: user, isPending: isUserPending } = useMe();

  const eligibility = useQuery({
    queryKey: reviewKeys.eligibility(productId, user?.id),
    queryFn: () => unwrapResult(getReviewEligibilityAction(productId)),
    enabled: Boolean(user),
  });

  if (isUserPending) return <Skeleton className="h-12 w-full" />;

  if (!user) {
    return (
      <Note>
        <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} className="font-medium text-brand underline">
          Log in
        </Link>{" "}
        to review a product you have bought.
      </Note>
    );
  }

  if (eligibility.isPending) return <Skeleton className="h-12 w-full" />;
  if (eligibility.isError) return <Note>{eligibility.error.message}</Note>;

  switch (eligibility.data) {
    case "admin":
      return null;
    case "reviewed":
      return <Note>You have reviewed this product. Thank you!</Note>;
    case "not-purchased":
      return <Note>Only customers who received this product can review it.</Note>;
    default:
      return (
        <WriteReview
          productId={productId}
          onDone={() => {
            queryClient.setQueryData(reviewKeys.eligibility(productId, user.id), "reviewed");
            // Loads the new review and rating from the server.
            router.refresh();
          }}
        />
      );
  }
};

export default ReviewForm;
