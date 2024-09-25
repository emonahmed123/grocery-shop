/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Spinner,
} from "@nextui-org/react";
import { useAuth } from "@/lib/AuthProviders";
import Swal from "sweetalert2";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user, token } = useAuth();
    const columns = [
        {
            key: "username",
            label: "User Name",
        },
        {
            key: "total",
            label: "Total Amount",
        },
        {
            key: "quantity",
            label: "Quantity",
        },
        {
            key: "status",
            label: "Status",
        },
        {
            key: "action",
            label: "Action",
        },
    ];
    useEffect(() => {
        const fetchOrders = async () => {
            try {

                const res = await fetch(`https://grocery-store-server-orpin.vercel.app/api/bookings`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const { data } = await res.json();
                console.log(data)
                setOrders(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log("Something went wrong. try Again!",)
            }
        };

        fetchOrders();
    }, [user, token]);

    const handleDeliveredProduct = async (id: string) => {
        try {
            const res = await fetch(`https://grocery-store-server-orpin.vercel.app/api/bookings/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            console.log(data);
            if (data.success) {
                setOrders((prevOrders: any) =>
                    prevOrders.map((order: any) => {
                        if (order._id === id) {
                            return { ...order, status: "delivered" };
                        }
                        return order;
                    })
                );


                Swal.fire({
                    title: "Order Delivered Successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                Swal.fire({
                    title: "Order Not Delivered  ",
                    text: "Contact with Developer",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } catch (error) {


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
        <>
            <div className="mt-10">
                <h1 className="text-3xl font-semibold text-center mb-10 pb-2 border-b-2 border-gray-300 ">
                    All Orders
                </h1>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            {columns.map((column) => (
                                <TableColumn key={column.key}>{column.label}</TableColumn>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {orders?.map((order: any) => (
                                <TableRow key={order._id}>
                                    <TableCell>{order?.userId.name}</TableCell>
                                    <TableCell>{order?.totalAmount}</TableCell>
                                    <TableCell>{order?.quantity}</TableCell>
                                    <TableCell>{order?.status}</TableCell>
                                    <TableCell>
                                        {order?.status === "delivered" ? <p className="text-green-500">Delivery Completed</p> :
                                            <Button
                                                onClick={() => handleDeliveredProduct(order._id)}

                                                color="primary"
                                                variant="shadow"
                                                size="sm"
                                            >
                                                Delivered
                                            </Button>

                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </>
    );
};

export default OrdersPage;