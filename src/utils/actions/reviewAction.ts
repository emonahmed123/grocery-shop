"use server";

import { getToken } from "./Authaction";

export const postReview = async (reviewData: {
  userName: string;
  review: string;
  productId: string;
}) => {
  try {
    const token = await getToken();
    const res = await fetch(
      `https://grocery-store-server-orpin.vercel.app/api/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      }
    );
    const data = await res.json();
    console.log(data);
    if (data.success) {
      return data;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
