import type { Metadata } from "next";

import FlashSaleManager from "@/components/dashboard/flash-sale/FlashSaleManager";
import PrefetchBoundary from "@/components/dashboard/PrefetchBoundary";
import { DEFAULT_FLASH_SALE_QUERY, flashSaleQuery } from "@/queries/flashSale.queries";

export const metadata: Metadata = {
  title: "Flash Sale | BoroBazar Dashboard",
};

export default function FlashSalePage() {
  return (
    <PrefetchBoundary queries={[flashSaleQuery(DEFAULT_FLASH_SALE_QUERY)]}>
      <FlashSaleManager />
    </PrefetchBoundary>
  );
}
