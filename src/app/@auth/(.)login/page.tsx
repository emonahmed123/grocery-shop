"use client";
import Loginpage from "@/app/login/page";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomModel from "@/components/modal/CustomModel";
import { login } from "@/utils/actions/Authaction";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
type FormValues = {
  email: string;
  password: string;
};

const LoginModal = () => {
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
    <CustomModel>
      <Loginpage />
    </CustomModel>
  );
};

export default LoginModal;
