import Link from "next/link";


const NotFoundPage = () => {
    return (
        <div className="flex justify-center items-center  h-[100vh] flex-col gap-y-10">


            <h1 className="text-5xl font-bold ">404 Page NotFound</h1>

            <Link href={"/"}>Back Home</Link>

        </div>
    );
};

export default NotFoundPage;