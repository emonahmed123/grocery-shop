"use client"

import UpdateModel from "@/components/updateModel/UpdateModel"
import { useAuth } from "@/lib/AuthProviders"
import { TGroceryItem } from "@/Types"
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import Image from "next/image"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"


const AllProducts = () => {
    const { user, token } = useAuth();

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`https://grocery-store-server-orpin.vercel.app/api/product`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const { data } = await res.json();

                setProducts(data);
                setLoading(false);
            } catch (error) {
                Swal.fire({
                    title: "Something is wrong",
                    text: "Contact with Developer",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
                });
                setLoading(false);
            }
        };

        fetchOrders();

    }, [user, token])
    console.log(products)
    const handleDeleteProduct = async (id: string) => {
        console.log(id)
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
                    timer: 1500
                });
                setProducts(products.filter((product: TGroceryItem) => product._id !== id));
            } else {
                Swal.fire({
                    title: "Product deleted Not Deleted",
                    text: "Contact with Developer",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {
            console.log(error);

            Swal.fire({
                title: "Something went wrong. try Again!",
                text: "Contact with Developer",
                icon: "error",
                showConfirmButton: false,
                timer: 1500
            })
        }
    };

    return (
        <div>
            <div >
                <h1 className="text-center text-[30px] leading-[40px] mb-5">All Products</h1>
            </div>
            {loading ? <div> Loading...</div> : (
                <Table>
                    <TableHeader>
                        {columns.map((column) => (
                            <TableColumn key={column.key}>{column.label}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {products?.map((product: TGroceryItem) => (
                            <TableRow key={product?._id}>
                                <TableCell>
                                    <Image
                                        alt="product_image"
                                        src={product.image}
                                        width={50}
                                        height={50}
                                    />
                                </TableCell>
                                <TableCell>{product?.name}</TableCell>
                                <TableCell>{product?.price}</TableCell>

                                <TableCell className="flex items-center gap-3">
                                    <UpdateModel
                                        product={product}
                                        setProducts={setProducts}
                                    />
                                    <Button
                                        onClick={() => handleDeleteProduct(product?._id)}
                                        color="danger"
                                        variant="shadow"
                                        size="sm"
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            )}
        </div>
    )
}

export default AllProducts