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
//   import AddBtn from "../ui/AddBtn";

const ProductCard = ({ item }: { item: TGroceryItem }) => {
    return (
        <>
            <Card shadow="sm" className="">
                <CardBody className="overflow-visible p-0 h-[400px]">
                    <Image
                        // shadow="sm"
                        // radius="lg"
                        height={50}

                        width={100}
                        src={item.image}
                        alt="Grocery"
                        className="w-full object-cover rounded-lg"
                    />
                    <h3 className="my-3 px-3">{item.name}</h3>
                </CardBody>

                <CardFooter className="text-small justify-between">
                    <h1>{item.price}</h1>
                    <Tooltip content="add to cart">
                        <Button as={Link} href={`/product/${item.id}`} isIconOnly className="bg-transparent">
                            <AddBtn />
                        </Button>
                    </Tooltip>
                </CardFooter>
            </Card>
        </>
    );
};


export default ProductCard;