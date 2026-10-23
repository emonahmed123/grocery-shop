import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div">;

/** Page-width wrapper shared by the header, home sections and footer. */
const Container = ({ className, ...props }: ContainerProps) => {
  return (
    <div
      className={cn("mx-auto w-full max-w-360 px-4 md:px-6 lg:px-8", className)}
      {...props}
    />
  );
};

export default Container;
