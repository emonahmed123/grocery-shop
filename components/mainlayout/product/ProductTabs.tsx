import NutritionFacts from "@/components/mainlayout/product/NutritionFacts";
import ProductReviews from "@/components/mainlayout/product/ProductReviews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProductReview } from "@/types/review.types";

type ProductTabsProps = {
  productId: string;
  description?: string;
  reviews: ProductReview[];
  averageRating: number;
  ratingCount: number;
};

const ProductTabs = ({ productId, description, reviews, averageRating, ratingCount }: ProductTabsProps) => {
  return (
    <Tabs defaultValue="details" className="mt-10 lg:mt-14">
      <div className="border-b pb-1">
        <TabsList variant="line">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
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
        <ProductReviews
          productId={productId}
          reviews={reviews}
          averageRating={averageRating}
          ratingCount={ratingCount}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
