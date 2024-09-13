/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button, Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";

import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";

type FormValues = {
    email: string;
    password: string;
};

const Loginpage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        console.log(data);




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
                                type="password"
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
                        </div>

                        <div className="form-control mb-8">
                            <Button
                                fullWidth
                                color="primary"
                                type="submit"
                                className="btn btn-accent btn-outline font-semibold"
                            >
                                Login
                            </Button>
                        </div>
                        <p className="text-center">
                            Don&apos;t have an account?{" "}
                            <Link className="text-red-200" href="/register">
                                Create an account
                            </Link>
                        </p>
                    </form>

                    <button
                        onClick={() =>
                            signIn("github", {
                                callbackUrl: "http://localhost:3000",
                            })
                        }
                    >
                        github
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Loginpage;
