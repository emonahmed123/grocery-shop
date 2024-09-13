"use server";

export const signUp = async (data) => {
  const res = await fetch(`${process.env.BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const userInfo = await res.json();

  return userInfo;
};
