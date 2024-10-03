"use client";
import { Button, Textarea } from "@nextui-org/react";
import { useAuth } from "@/lib/AuthProviders";
import { useState } from "react";
import { postReview } from "@/utils/actions/reviewAction";
import Swal from "sweetalert2";

const ReviewForm = ({ id }: { id: string }) => {
  const { user } = useAuth();
  const [review, setReview] = useState("");
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom",
    iconColor: "blue",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
  const handlePostReview = async () => {
    if (review.length < 5) {
      await Toast.fire({
        icon: "error",
        title: "Review must be at least 5 character",
      });
      return;
    }

    const result = await postReview({
      userName: user?.name,
      review,
      productId: id,
    });

    if (result?.success) {
      await Toast.fire({
        icon: "success",
        title: "Review Add Successfully",
      });

      setReview("");
    } else {
      await Toast.fire({
        icon: "error",
        title: "something went wrong! try again",
      });
      console.log(result);
    }
  };

  return (
    <div className="space-y-5 mt-5">
      <h2 className="text-xl md:text-2xl border-l-3 border-primary pl-1">
        Write a Reviews
      </h2>
      <Textarea
        label="Review"
        placeholder="Write your thought about the product"
        className="max-w-2xl"
        onChange={(e) => setReview(e.target.value)}
      />
      <Button
        onClick={handlePostReview}
        isDisabled={!user}
        variant="bordered"
        color="primary"
        className="hover:bg-primary text-black transition-all duration-500"
      >
        Post
      </Button>
      {!user && <p>You must be logged in to post a review !</p>}
    </div>
  );
};

export default ReviewForm;
