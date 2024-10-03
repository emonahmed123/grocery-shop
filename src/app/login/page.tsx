/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { login } from "@/utils/actions/Authaction";
import { Button, Input, Spinner, Tooltip } from "@nextui-org/react";
import { signIn } from "next-auth/react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheck, FiCopy } from "react-icons/fi";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import Swal from "sweetalert2";

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
    <section className="py-[90px] ">
      <h1 className="text-center text-4xl mb-5 font-semibold">
        Login <span className="text-secondary">Here</span>
      </h1>
      <div className=" flex justify-center">
        <div className="  w-[360px] md:w-[400px]    shadow-xl bg-base-100 px-5 py-10 border rounded-[9px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control mb-8 relative">
              <Input
                {...register("email", { required: "Email is required" })}
                isRequired
                type="email"
                size="sm"
                label="Email"
                variant="bordered"
                className="max-w-md mb-1"
              />
              <label className="absolute">
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    Email is required
                  </span>
                )}
              </label>
            </div>

            <div className="form-control mb-8 relative">
              <Input
                {...register("password", {
                  required: "Password is required",
                  maxLength: {
                    value: 15,
                    message: "Password cannot exceed 15 characters",
                  },
                })}
                isRequired
                type={visible ? "text" : "password"}
                size="sm"
                fullWidth
                label="Password"
                variant="bordered"
                className="max-w-md"
              />

              <label htmlFor="password" className=" absolute ">
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {(errors?.password?.message as string) ||
                      "Password is required"}
                  </span>
                )}
              </label>
              <span
                className=" text-gray-400 absolute  inset-0 left-auto px-2 flex items-center cursor-pointer   h-full"
                onClick={toggleVisible}
              >
                {visible ? (
                  <RxEyeOpen className="w-5 h-5  " />
                ) : (
                  <RxEyeClosed className="w-5 h-5 " />
                )}
              </span>
            </div>

            <div className="form-control mb-8">
              <Button
                fullWidth
                color="primary"
                type="submit"
                className="btn btn-accent btn-outline font-semibold"
              >
                {loading ? <Spinner size="sm" color="white" /> : "Login"}
              </Button>
            </div>
            <p className="text-center">
              Don&apos;t have an account?{" "}
              <Link className="text-red-200" href="/register">
                Create an account
              </Link>
            </p>
          </form>

          {/* <button
                        onClick={() =>
                            signIn("github", {
                                callbackUrl: "http://localhost:3000",
                            })
                        }
                    >
                        github
                    </button> */}
        </div>
      </div>

      <div className="mt-10 flex justify-center font-poppe">
        <div className="w-[360px] md:w-[400px] shadow-xl bg-base-100 px-5 py-6 border rounded-[9px]">
          <h2 className="text-xl font-semibold mb-4">
            Admin Login And User Login And Password
          </h2>
          <div className="flex flex-col space-x-2 mb-5 relative">
            <label className="text-[14px] text-gray-500 mb-2" htmlFor="admin">
              Admin
            </label>
            <input
              name="admin"
              value={textToCopy}
              readOnly
              className="flex-grow bg-black text-white text-[10px] px-3 py-3 "
            />

            <button
              className="absolute inset-0 left-auto top-4 px-2 flex items-center cursor-pointer   h-full"
              aria-label="Copy"
              onClick={() => copyToClipboard(textToCopy, true)}
            >
              {adminCopySuccess ? (
                <FiCheck color="white" />
              ) : (
                <FiCopy color="white" />
              )}
            </button>
          </div>
          <div className="flex flex-col space-x-2 relative">
            <label className="text-[14px] text-gray-500 mb-1" htmlFor="">
              User
            </label>

            <input
              value={secnodtextCoopy}
              readOnly
              className="flex-grow bg-black text-white text-[10px] px-3 py-3 "
            />

            <button
              className="absolute inset-0 left-auto px-2 flex items-center cursor-pointer h-full top-4"
              onClick={() => copyToClipboard(secnodtextCoopy, false)}
            >
              {userCopySuccess ? (
                <FiCheck color="white" />
              ) : (
                <FiCopy color="white" />
              )}
            </button>
          </div>
          <div className="flex flex-col space-x-2 relative">
            <label className="text-[14px] text-gray-500 mb-1" htmlFor="">
              Password
            </label>

            <input
              value={password}
              readOnly
              className="flex-grow bg-black text-white text-[10px] px-3 py-3 "
            />

            <button
              className="absolute inset-0 left-auto px-2 flex items-center cursor-pointer h-full top-4"
              onClick={() => copyToClipboard(password, false)}
            >
              {passwordCopySuccess ? (
                <FiCheck color="white" />
              ) : (
                <FiCopy color="white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loginpage;
