"use client";
import { useRouter } from "next/navigation";

import { useEffect, useRef } from "react";
const CustomModel = ({ children }) => {
  const modalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!modalRef.current?.open) {
      modalRef.current?.showModal();
    }
  }, []);

  function onHide() {
    router.back();
  }

  return (
    <dialog
      ref={modalRef}
      onClose={onHide}
      className="shadow-teal-700 shadow-md border border-teal-600  p-2 rounded-md dark:bg-black dark:bg-opacity-95 dark:text-gray-100 w-full "
    >
      {children}
    </dialog>
    // document.getElementById("modal-root")
  );
};

export default CustomModel;
