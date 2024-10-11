/* eslint-disable @typescript-eslint/no-explicit-any */

// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "@nextui-org/react";
// import Image from "next/image";
// import { useAuth } from "@/lib/AuthProviders";

// const UserOrdersTable = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { user, token } = useAuth();

//   console.log(orders);

//   useEffect(() => {
//     setLoading(true);
//     const fetchOrders = async () => {
//       if (user?.userId && token) {
//         try {
//           const res = await fetch("https://grocery-store-server-orpin.vercel.app/api/bookings/user", {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           const { data } = await res.json();
//           // console.log(data);
//           setOrders(data);

//           setLoading(false);
//         } catch (error) {
//           console.log(error);
//           setLoading(false);
//         }
//       }
//     };

//     fetchOrders();
//   }, [user, token]);

//   const columns = [
//     {
//       key: "products",
//       label: "Products",
//     },
//     {
//       key: "total",
//       label: "Total Amount",
//     },
//     {
//       key: "status",
//       label: "Status",
//     },
//   ];
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="relative">
//           <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
//           <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="py-10  ">
//       <h1 className="text-3xl font-semibold text-center mb-5 pb-2  ">
//         My <span className="text-secondary">Orders</span>
//       </h1>
//       {orders.length > 0 ? (
//         <Table  >
//           <TableHeader>
//             {columns.map((column) => (
//               <TableColumn key={column.key}>{column.label}</TableColumn>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {orders?.map((order: any) => (
//               <TableRow key={order._id}>
//                 <TableCell className="w-16 text-black">
//                   {order?.products?.map((product: any) => (
//                     <div
//                       key={product._id}
//                       className="flex items-center gap-5 rounded-full  "
//                     >
//                       <Image
//                         src={product?.image}
//                         alt="product_image"
//                         width={50}
//                         height={50}
//                         className="w-[50] h-[50] border my-2"
//                       />
//                       <p>{product?.name}</p>
//                     </div>
//                   ))}
//                 </TableCell>
//                 <TableCell className="w-16 text-black">
//                   {order?.totalAmount}
//                 </TableCell>

//                 <TableCell className="w-16 text-black">
//                   <span
//                     className={`${
//                       order?.status === "pending"
//                         ? "bg-yellow-500"
//                         : order?.status === "delivered"
//                         ? "bg-green-500"
//                         : "bg-red-500"
//                     } text-white px-2 py-1 rounded-md`}
//                   >
//                     {order?.status}
//                   </span>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       ) : (
//         <h1 className="text-center mt-10 text-danger">You have no Oreder </h1>
//       )}
//     </div>
//   );
// };

// export default UserOrdersTable;

"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import useSWR from "swr";
import { useAuth } from "@/lib/AuthProviders";
import Image from "next/image";

const fetcher = async (url: string, token: string) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return response.json();
};

const UserOrdersTable = () => {
  const [page, setPage] = useState(1);
  const { user, token } = useAuth();
  const rowsPerPage = 4;

  const { data, error, isLoading } = useSWR(
    user?.userId && token
      ? [
          `https://grocery-store-server-orpin.vercel.app/api/bookings/user`,
          token,
        ]
      : null,
    ([url, token]) => fetcher(url, token)
  );

  console.log("Data:", data); // Debugging
  console.log("Error:", error); // Debugging
  console.log("Is Loading:", isLoading); // Debugging

  const orders = useMemo(() => data?.data || [], [data]);

  const pages = Math.ceil(orders.length / rowsPerPage);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return orders.slice(start, end);
  }, [page, orders]);

  const columns = [
    { key: "products", label: "Products" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "status", label: "Status" },
  ];

  if (error) return <div>Failed to load orders: {error.message}</div>;
  if (!isLoading && orders.length === 0)
    return <div className="pt-10 mt-10 text-center ">No orders found.</div>;

  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold text-center mb-5 pb-2 mt-2">
        My <span className="text-secondary">Orders</span>
      </h1>
      <Table
        aria-label="User orders table with client-side pagination"
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody
          items={paginatedOrders}
          loadingContent={<Spinner />}
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(item: any) => (
            <TableRow key={item._id as string}>
              <TableCell>
                {item.products?.map((product: any) => (
                  <div
                    key={product._id as string}
                    className="flex items-center gap-5 rounded-full"
                  >
                    <Image
                      src={product.image}
                      alt="product_image"
                      width={50}
                      height={50}
                      className="w-[50px] h-[50px] border my-2"
                    />
                    <p className="text-[10px] sm:text-[14px]">{product.name}</p>
                  </div>
                ))}
              </TableCell>
              <TableCell>{item.totalAmount}</TableCell>
              <TableCell>
                <span
                  className={`${
                    item.status === "pending"
                      ? "bg-yellow-500"
                      : item.status === "delivered"
                      ? "bg-green-500"
                      : "bg-red-500"
                  } text-white px-2 py-1 rounded-md`}
                >
                  {item.status}
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserOrdersTable;
