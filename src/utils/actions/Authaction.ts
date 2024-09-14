/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const signUp = async (data: any) => {
  const res = await fetch(`${process.env.BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache:'no-store'
  });

  const userInfo = await res.json();

  return userInfo;
};

type TLoginInfo = {
  email: string;
  password: string;
};

export const login = async (loginInfo: TLoginInfo) => {
  // login logic here
  const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginInfo),
  });

  const data = await res.json();
  console.log(data.data.accessToken);
  if (data?.success) {
    cookies().set("token", data?.data.accessToken);
  }

  return data;
};

export const getUserInfo = async () => {
  const token = cookies().get("token")?.value;
  let decodedData = null;
  if (token) {
    decodedData = (await jwtDecode(token)) as any;

    return decodedData;
  } else {
    return null;
  }
};

export const removeUserInfo = async () => {
  cookies().delete("token");
};

export const getToken = () => {
  return cookies().get("token")?.value;
};
