import {
    Button,
    Card,
    CardBody,
    CardFooter,

    Tooltip,
} from "@nextui-org/react";
import AddBtn from "./AddBtn";
import Image from "next/image";
import { TGroceryItem } from "@/Types";
import Link from "next/link";
import AddButtonCart from "./AddButtonCart";
import { FaArrowRight } from "react-icons/fa";
//   import AddBtn from "../ui/AddBtn";

const ProductCard = ({ item }: { item: TGroceryItem }) => {



    return (
        <>
            <Card shadow="sm" className="p-5">
                <CardBody className="p-0 mb-2">
                    <Image

                        height={200}

                        width={200}
                        src={item.image}
                        alt="Grocery"
                        className="w-full object-cover h-[200px] rounded-lg"
                    />
                    <h3 className="my-3  text-[16px] leading-[20px] font-medium">{item.name}</h3>

                    <div className="flex justify-between items-center">
                        <h1 className="text-[16px] leading-[20px] font-semibold">{item.price}TK</h1>
                        <Tooltip content="add to cart">
                            <Button isIconOnly className="  bg-gradient-to-tr from-primary to-yellow-500 text-white shadow-lg">
                                <AddButtonCart product={item} ><AddBtn /></AddButtonCart>
                            </Button>
                        </Tooltip>
                    </div>
                </CardBody>

                <CardFooter className="w-full p-0">

                    <Button className="w-full bg-primary text-white font-semibold text-[16px] leading-[24px] rounded-[5px]" as={Link} href={`/product/${item._id}`} >
                        Veiw Details <FaArrowRight className="ml-2" />
                    </Button>

                </CardFooter>
            </Card>
        </>
    );
};


export default ProductCard;