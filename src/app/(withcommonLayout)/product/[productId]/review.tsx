import { Avatar, AvatarIcon } from "@nextui-org/react";
import ReviewForm from "./ReviewForm";

type TReview = {
  _id: string;
  userName: string;
  review: string;
};
const Review = async ({ productId }: { productId: string }) => {
  const response = await fetch(
    `https://grocery-store-server-orpin.vercel.app/api/reviews/${productId}`,
    {
      cache: "no-store",
    }
  );
  const { data: reviews } = await response.json();
  return (
    <div className="font-poppins">
      <h2 className="text-xl md:text-2xl border-l-3 border-primary pl-1 mb-5">
        Reviews
      </h2>
      <div className="w-full md:w-2/3">
        {reviews.length
          ? reviews?.map((review: TReview) => (
              <div key={review._id} className="border-b-1 pb-1 mb-3 pb-3">
                <div className="flex items-center gap-2 mb-2">
                  {" "}
                  <Avatar
                    size="sm"
                    icon={<AvatarIcon />}
                    classNames={{
                      base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                      icon: "text-black/80",
                    }}
                  />
                  <h3 className="font-semibold text-[14px] leading-[22px]">
                    {review.userName}
                  </h3>
                </div>
                <p className="text-[14px] leading-[22px] italic text-gray-500 pl-10">
                  {review.review}
                </p>
              </div>
            ))
          : "There is no review for this product"}
      </div>
      <div>
        <ReviewForm id={productId} />
      </div>
    </div>
  );
};

export default Review;
