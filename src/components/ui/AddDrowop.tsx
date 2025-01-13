/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";
import Link from "next/link";

const AddDrowop = ({ UserData }: { UserData: any }) => {
  return (
    <div className="overflow-hidden">
      <Dropdown placement="bottom-start" backdrop="blur" showArrow radius="sm">
        <DropdownTrigger>
          {UserData && (
            <User
              name={UserData?.name}
              description={UserData?.role}
              avatarProps={{
                src: `${UserData?.image}`,
                alt: "Image",
              }}
            />
          )}
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">{UserData?.email}</p>
          </DropdownItem>
          <DropdownItem key="settings">
            <Link href="/dashboard/myprofile">My Profile</Link>
          </DropdownItem>

          <DropdownItem key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default AddDrowop;
