/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { login } from "@/utils/actions/Authaction";

import { Button, Spinner } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheck, FiCopy } from "react-icons/fi";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import Swal from "sweetalert2";
import Emaillogo from "../svg/Emaillogo";
import Google from "../svg/Google";
type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [adminCopySuccess, setAdminCopySuccess] = useState(false);
  const [userCopySuccess, setUserCopySuccess] = useState(false);
  const [passwordCopySuccess, setPasswordCopySuccess] = useState(false);

  const textToCopy = "imonshomon@gmail.com";
  const secnodtextCoopy = "emons@gmail.com";
  const password = "123456";
  const copyToClipboard = async (text: string) => {
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
    <>
      <div className="rounded-sm border border-stroke bg-white  shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex  flex-col md:flex-row  p-5 ">
          <div className=" w-full xl:w-1/2">
            <div className=" px-5 text-center">
              <Link
                className="mb-3 inline-block text-primary italic underline "
                href="/"
              >
                <Image
                  src="https://borobazar.vercel.app/_next/static/media/logo.026129ac.svg"
                  width={131}
                  height={30}
                  alt="logo"
                />
              </Link>

              <p className="2xl:px-20 text-gray-500 mb-12">
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
            <div className="px-5">
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
                        <Emaillogo />
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
                    <Google />
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
    </>
  );
};

export default Login;
