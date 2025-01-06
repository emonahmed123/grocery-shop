"use client";

import UpdateModel from "@/components/updateModel/UpdateModel";
import { useAuth } from "@/lib/AuthProviders";
import { TGroceryItem } from "@/Types";
import {
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { PiPlusCircleDuotone } from "react-icons/pi";
import Swal from "sweetalert2";
import useSWR from "swr";

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

const AllProducts = () => {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  // const [loading] = useState(true);

  const columns = [
    {
      key: "image",
      label: "Product Image",
    },
    {
      key: "name",
      label: "Product Name",
    },
    {
      key: "price",
      label: "Price",
    },

    {
      key: "action",
      label: "Actions",
    },
  ];

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const res = await fetch(
  //         `https://grocery-store-server-orpin.vercel.app/api/product`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const { data } = await res.json();

  //       setProducts(data);
  //       setLoading(false);
  //     } catch (error) {
  //       Swal.fire({
  //         title: "Something is wrong",
  //         text: "Contact with Developer",
  //         icon: "error",
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //       setLoading(false);
  //     }
  //   };

  //   fetchOrders();
  // }, [user, token]);
  // console.log(products);

  const rowsPerPage = 10;

  const { data, error, isLoading } = useSWR(
    token
      ? [`https://grocery-store-server-orpin.vercel.app/api/product`, token]
      : null,
    ([url, token]) => fetcher(url, token)
  );

  console.log("Data:", data); // Debugging
  console.log("Error:", error); // Debugging
  console.log("Is Loading:", isLoading); // Debugging

  const Allprod = useMemo(() => data?.data || [], [data]);
  // console.log("kdsf", Allprod);
  const pages = Math.ceil(Allprod.length / rowsPerPage);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return Allprod.slice(start, end);
  }, [page, Allprod]);

  if (error) return <div>Failed to load orders: {error.message}</div>;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <div className="mb-10">
            <h1 className="text-center text-[30px] leading-[40px] font bold">
              All <span className="text-secondary">Products</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <Button color="primary" endContent={<PiPlusCircleDuotone />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {Allprod?.length} Product
          </span>
        </div>
      </div>
    );
  }, [Allprod]);

  if (!isLoading && Allprod.length === 0)
    return <div className="pt-10 mt-10 text-center ">No orders found.</div>;

  const handleDeleteProduct = async (id: string) => {
    console.log(id);
    try {
      const res = await fetch(
        `https://grocery-store-server-orpin.vercel.app/api/product/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.success) {
        Swal.fire({
          title: "Product deleted successfully",

          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        setProducts(
          products.filter((product: TGroceryItem) => product._id !== id)
        );
      } else {
        Swal.fire({
          title: "Product deleted Not Deleted",
          text: "Contact with Developer",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Something went wrong. try Again!",
        text: "Contact with Developer",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="font-Poppis py-10">
      <Table
        aria-label="All Product table with client-side pagination"
        topContent={topContent}
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
          {paginatedOrders?.map((product: TGroceryItem) => (
            <TableRow key={product?._id}>
              <TableCell>
                <Image
                  alt="product_image"
                  src={product.image}
                  width={30}
                  height={30}
                />
              </TableCell>
              <TableCell>
                <h1 className="text-[13px]">{product?.name} </h1>{" "}
              </TableCell>
              <TableCell>{product?.price}</TableCell>

              <TableCell className="flex items-center gap-3">
                <UpdateModel product={product} setProducts={setProducts} />
                <Button
                  onClick={() => handleDeleteProduct(product?._id)}
                  color="danger"
                  variant="shadow"
                  size="sm"
                  className="text-white"
                  isIconOnly
                >
                  <FaTrash size={15} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllProducts;
// after code refactroing