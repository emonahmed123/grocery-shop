import ProductGrid from "@/components/mainlayout/home/ProductGrid";
import Container from "@/components/mainlayout/layout/Container";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getApiErrorMessage } from "@/lib/axios/httpClient";
import type { Paginated } from "@/types/api.types";
import type { Product } from "@/types/product";

type ProductSectionProps = {
  title: string;
  description: string;
  load: () => Promise<Paginated<Product>>;
  viewAllHref?: string;
  /** Leave the section out when it has no products, e.g. no flash sale running. */
  hideWhenEmpty?: boolean;
};

/**
 * Loads one home section on the server. Each section sits in its own
 * Suspense boundary, so a slow one does not hold back the rest of the page.
 */
const ProductSection = async ({ title, description, load, viewAllHref, hideWhenEmpty }: ProductSectionProps) => {
  let products: Product[];
  try {
    products = (await load()).data;
  } catch (error) {
    return (
      <Container className="mb-12">
        <Alert variant="destructive">
          <AlertDescription>
            {title}: {getApiErrorMessage(error, "Products could not be loaded")}
          </AlertDescription>
        </Alert>
      </Container>
    );
  }

  if (products.length === 0) {
    if (hideWhenEmpty) return null;
    return (
      <Container className="mb-12">
        <p className="rounded-md border p-8 text-center text-sm text-muted-foreground">No products yet.</p>
      </Container>
    );
  }

  return <ProductGrid title={title} description={description} products={products} viewAllHref={viewAllHref} />;
};

export default ProductSection;
