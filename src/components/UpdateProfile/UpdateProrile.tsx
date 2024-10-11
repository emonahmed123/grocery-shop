/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use clinet";
import { useAuth } from "@/lib/AuthProviders";
import {
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";

const UpdateProrile = ({
  setUserData,
  userData,
}: {
  userData: any;
  setUserData: any;
}) => {
  const { token } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    const { name, address, phone, ...rest } = data;
    console.log(data);
    const updateData = {
      name: name || userData?.name,
      phone: phone || userData?.phone,
      address: address || userData?.address,
      ...rest,
    };
    console.log(updateData);
    const res = await fetch(
      `https://grocery-store-server-orpin.vercel.app/api/auth/change`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      }
    );
    const result = await res.json();

    if (result.success) {
      setUserData((prevData: any) => ({
        ...prevData,
        name: updateData.name,
        phone: updateData.phone,
        address: updateData.address,
      }));

      Swal.fire({
        title: "Product updated successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      onOpenChange();
    } else {
      Swal.fire({
        title: "Some thing was wrong",
        text: `${result.message}`,
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <>
      <Button className="bg-danger text-whiten font-mono" onPress={onOpen}>
        {" "}
        Edit Profile <FaEdit />{" "}
      </Button>
      <Modal
        size="3xl"
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Profile Update
              </ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Name"
                      placeholder="Enter your Name"
                      type="text"
                      variant="bordered"
                      {...register("name")}
                    />
                    <Input
                      label="Phone"
                      placeholder="Enter your Name"
                      type="text"
                      variant="bordered"
                      {...register("phone")}
                    />
                    <Input
                      label="Address"
                      placeholder="Enter your Name"
                      type="text"
                      variant="bordered"
                      {...register("address")}
                    />
                  </div>

                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button type="submit" color="primary">
                      Edit Profile
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateProrile;
