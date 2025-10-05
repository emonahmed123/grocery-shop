/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Singuplogo from "@/components/svg/Singuplogo";
import Userlogo from "@/components/svg/Userlogo";
import { signUp } from "@/utils/actions/Authaction";
import { Button, Spinner } from "@nextui-org/react";
import Image from "next/image";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import Swal from "sweetalert2";
import Emaillogo from "../../components/svg/Emaillogo";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible(!visible);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    // console.log(data);

    try {
      setLoading(true);
      const res = await signUp(data);

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

        router.push("/login");
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
    <section className="py-[80px] max-w-[1170px] mx-auto px-5 xl:px-0">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-[60px] py-[40px] text-center">
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
                Sign up to continue
              </p>

              <span className="mt-15 inline-block">
                <Singuplogo />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">
                Start for enjoying
              </span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign up to EasGrocery
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      {...register("name", { required: "Name is required" })}
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <span className="absolute right-4 top-4">
                      <Userlogo />
                    </span>{" "}
                    <label className="absolute">
                      {errors.name && (
                        <span className="text-red-500 text-sm">
                          Name is required
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="mb-2.5 block font-medium text-black dark:text-white"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      {...register("email", { required: "Email is required" })}
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
                        <RxEyeOpen className="w-5 h-5  text-gray-500" />
                      ) : (
                        <RxEyeClosed className="w-5 h-5  text-gray-500" />
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
                    {loading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </div>

                <div className="mt-6 text-center">
                  <p>
                    Already have an account?{" "}
                    <Link href="login" className="text-primary">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
