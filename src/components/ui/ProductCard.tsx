import { Button, Card, CardBody, CardFooter, Tooltip } from "@nextui-org/react";
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
      <Card className="p-5 shadow-card">
        <CardBody className="p-0 mb-2 ">
          <Image
            height={200}
            width={200}
            src={item.image}
            alt="Grocery"
            className="w-full    object-cover h-[200px]   rounded-lg  "
          />
          <h3 className="mt-3 mb-1  text-[16px] leading-[20px] font-medium text-[#000]">
            {item.name}
          </h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 220 40"
            width="90"
            height="40"
          >
            <defs>
              <symbol id="star" viewBox="0 0 24 24">
                <path d="M12 .587l3.668 7.429L23.524 9.75l-5.68 5.535L19.812 24 12 19.797 4.188 24l1.968-8.715-5.68-5.535 7.856-1.734L12 .587z" />
              </symbol>
            </defs>
            <g fill="gold">
              <use href="#star" x="0" y="0" width="24" height="24" />
              <use href="#star" x="44" y="0" width="24" height="24" />
              <use href="#star" x="88" y="0" width="24" height="24" />
              <use href="#star" x="132" y="0" width="24" height="24" />
              <use href="#star" x="176" y="0" width="24" height="24" />
            </g>
          </svg>
          <div className="flex justify-between items-center">
            <h1 className="text-[16px] leading-[20px] font-semibold text-[#000]">
              {item.price}TK
            </h1>
            <Tooltip content="add to cart">
              <Button
                isIconOnly
                className="  bg-gradient-to-tr from-primary to-yellow-500 text-white shadow-lg rounded-full"
              >
                <AddButtonCart product={item}>
                  <AddBtn />
                </AddButtonCart>
              </Button>
            </Tooltip>
          </div>
        </CardBody>

        <CardFooter className="w-full p-0">
          <Button
            className="w-full bg-[#02b290] text-white font-semibold text-[16px] leading-[24px] rounded-[5px]"
            as={Link}
            href={`/product/${item._id}`}
          >
            Veiw Details <FaArrowRight className="ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ProductCard;
