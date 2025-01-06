/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { login } from "@/utils/actions/Authaction";
import { Button, Image, Input, Spinner, Tooltip } from "@nextui-org/react";
import { signIn } from "next-auth/react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheck, FiCopy } from "react-icons/fi";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import Swal from "sweetalert2";
import { getServerSession } from "next-auth";
import { authOption } from "@/utils/authOptions";
type FormValues = {
  email: string;
  password: string;
};

const Loginpage = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [adminCopySuccess, setAdminCopySuccess] = useState(false);
  const [userCopySuccess, setUserCopySuccess] = useState(false);
  const [passwordCopySuccess, setPasswordCopySuccess] = useState(false);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const textToCopy = "imonshomon@gmail.com";
  const secnodtextCoopy = "emons@gmail.com";
  const password = "123456";
  const copyToClipboard = async (text: string, isAdmin: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (text.includes(textToCopy)) {
        setAdminCopySuccess(true);
        setTimeout(() => setAdminCopySuccess(false), 2000);
      } else if (text.includes(secnodtextCoopy)) {
        setUserCopySuccess(true);
        setTimeout(() => setUserCopySuccess(false), 2000);
      } else if (text.includes(password)) {
        setPasswordCopySuccess(true);
        setTimeout(() => setPasswordCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const res = await login(data);

      console.log(res);
      if (res?.success) {
        Swal.fire({
          title: `${res.message} `,
          text: "",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });

        setLoading(false);

        router.push("/");
      } else {
        Swal.fire({
          title: "Invaild Creadentail",
          text: "",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading(false);
      }
    } catch (error: any) {
      Swal.fire({
        title: "Some thing is wrong",
        text: "",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });

      setLoading(false);
    }
  };

  return (
    <section className="py-[50px] max-w-[1170px] mx-auto px-5 xl:px-0">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex  flex-col md:flex-row items-center ">
          <div className=" w-full xl:w-1/2">
            <div className="py-[20px] px-[20px]  md:px-[60px] md:py-[40px] text-center">
              <Link
                className="mb-5.5 inline-block text-primary italic underline "
                href="/"
              >
                <Image
                  src="https://borobazar.vercel.app/_next/static/media/logo.026129ac.svg"
                  width={131}
                  height={30}
                  alt="logo"
                />
              </Link>

              <p className="2xl:px-20 text-gray-500 mb-2">
                Admin and user credentials
              </p>

              <div className="mb-5 relative">
                <label className="text-start mb-3 block text-sm font-medium text-gray-500 dark:text-white">
                  Admin Input
                </label>
                <input
                  value={textToCopy}
                  readOnly
                  type="email"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                />
                <button
                  className="absolute inset-0 left-auto px-2 flex items-center cursor-pointer h-full top-4"
                  onClick={() => copyToClipboard(textToCopy, false)}
                >
                  {adminCopySuccess ? (
                    <FiCheck color="black" />
                  ) : (
                    <FiCopy color="black" />
                  )}
                </button>
              </div>
              <div className="mb-5 relative">
                <label className="text-start mb-3 block text-sm font-medium text-gray-500 dark:text-white">
                  User Input
                </label>
                <input
                  value={secnodtextCoopy}
                  readOnly
                  type="text"
                  placeholder="Default Input"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                />
                <button
                  className="absolute inset-0 left-auto px-2 flex items-center cursor-pointer h-full top-4"
                  onClick={() => copyToClipboard(secnodtextCoopy, false)}
                >
                  {userCopySuccess ? (
                    <FiCheck color="black" />
                  ) : (
                    <FiCopy color="black" />
                  )}
                </button>
              </div>
              <div className="mb-5 relative">
                <label className="text-start mb-3 block text-sm font-medium text-gray-500 dark:text-white">
                  Password Input
                </label>
                <input
                  value={password}
                  readOnly
                  type="text"
                  placeholder="Default Input"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                />
                <button
                  className="absolute inset-0 left-auto px-2 flex items-center cursor-pointer h-full top-4"
                  onClick={() => copyToClipboard(password, false)}
                >
                  {passwordCopySuccess ? (
                    <FiCheck color="black" />
                  ) : (
                    <FiCopy color="black" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">
                Start for enjoying
              </span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to BoroBazer
              </h2>
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="mb-2.5 block font-medium text-black dark:text-white"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                        {...register("email", {
                          required: "Email is required",
                        })}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />

                      <span className="absolute right-4 top-4">
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.5">
                            <path
                              d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      <label className="absolute">
                        {errors.email && (
                          <span className="text-red-500 text-sm">
                            Email is required
                          </span>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...register("password", {
                          required: "Password is required",
                          maxLength: {
                            value: 15,
                            message: "Password cannot exceed 15 characters",
                          },
                        })}
                        required
                        type={visible ? "text" : "password"}
                        placeholder="6+ Characters, 1 Capital letter"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />

                      <span
                        onClick={() => setVisible(!visible)}
                        className="absolute right-4 top-4"
                      >
                        {visible ? (
                          <RxEyeOpen className="w-5 h-5  " />
                        ) : (
                          <RxEyeClosed className="w-5 h-5 " />
                        )}
                      </span>

                      <label htmlFor="password" className=" absolute ">
                        {errors.password && (
                          <span className="text-red-500 text-sm">
                            {(errors?.password?.message as string) ||
                              "Password is required"}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="mb-5">
                    <Button
                      type="submit"
                      className="w-full cursor-pointer rounded-lg border border-primary bg-primary py-6 text-white transition hover:bg-opacity-90 text-[14px] font-bold "
                    >
                      {loading ? <Spinner size="sm" color="white" /> : "Login"}
                    </Button>
                  </div>
                </form>
                <button
                  className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50"
                  onClick={() =>
                    signIn("google", {
                      callbackUrl: "https://grocery-store-sable.vercel.app",
                    })
                  }
                >
                  <span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_191_13499)">
                        <path
                          d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217"
                          fill="#4285F4"
                        />
                        <path
                          d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999"
                          fill="#34A853"
                        />
                        <path
                          d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
                          fill="#EB4335"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_191_13499">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  Sign in with Google
                </button>

                <div className="mt-6 text-center">
                  <p>
                    Don’t have any account?{" "}
                    <Link href="/register" className="text-primary">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loginpage;
