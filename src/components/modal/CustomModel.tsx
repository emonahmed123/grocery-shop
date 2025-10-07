// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { useRouter } from "next/navigation";

// import { useState } from "react";
// import { Dialog, DialogContent } from "../ui/dialog";
// const CustomModel = ({ children }: any) => {

//   // const modalRef = useRef<HTMLDialogElement>(null);
//   const router = useRouter();

//   const onHide = () => {
//     router.back();
//   };

//   return (
//     // <dialog
//     //   ref={modalRef}
//     //   onClose={onHide}
//     //   className=" shadow-md   rounded-md dark:bg-black dark:bg-opacity-95 dark:text-gray-100 w-full "
//     // >
//     //   <span onClick={onHide}>x</span>
//     //   {children}
//     // </dialog>
//     // document.getElementById("modal-root")

//     <Dialog defaultOpen={true} open={open} onOpenChange={onHide}>
//       <DialogContent className="w-full">{children}</DialogContent>
//     </Dialog>
//   );
// };

// export default CustomModel;
