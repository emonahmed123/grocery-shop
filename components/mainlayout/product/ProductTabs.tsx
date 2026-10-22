import NutritionFacts from "@/components/mainlayout/product/NutritionFacts";
import ProductReviews from "@/components/mainlayout/product/ProductReviews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProductTabsProps = {
  description?: string;
};

const ProductTabs = ({ description }: ProductTabsProps) => {
  return (
    <Tabs defaultValue="details" className="mt-10 lg:mt-14">
      <div className="border-b pb-1">
        <TabsList variant="line">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="reviews">Review Rating</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="details" className="mt-4 lg:mt-6">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <p className="text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
              {description ??
                "Fresh, carefully sourced groceries delivered straight to your door."}
            </p>
          </div>
          <div className="lg:col-span-4">
            <NutritionFacts />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="reviews" className="mt-4 lg:mt-6">
        <ProductReviews />
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
