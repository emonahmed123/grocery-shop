"use client";

import { ArrowRight, Clock, DollarSign, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import StatCard from "@/components/dashboard/overview/StatCard";
import PageHeader from "@/components/dashboard/PageHeader";
import { CategoryName, ProductThumb } from "@/components/dashboard/products/productColumns";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrders, useAdminProducts } from "@/hooks/useDashboard";
import { useMe } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/assets";
import { OVERVIEW_PRODUCT_QUERY } from "@/lib/dashboardQueries";
import { formatDate, formatOrderId } from "@/lib/format";
import type { AdminOrder, AdminProduct } from "@/types/dashboard.types";

const LOW_STOCK = 10;

function getStats(products: AdminProduct[], orders: AdminOrder[]) {
  const delivered = orders.filter((order) => order.status === "delivered");
  const categoryCounts = new Map<string, number>();
  for (const product of products) {
    categoryCounts.set(product.category, (categoryCounts.get(product.category) ?? 0) + 1);
  }

  return {
    revenue: delivered.reduce((total, order) => total + order.totalAmount, 0),
    deliveredCount: delivered.length,
    pendingCount: orders.length - delivered.length,
    customerCount: new Set(orders.map((order) => order.customerName)).size,
    categoryCount: categoryCounts.size,
    topCategories: [...categoryCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6),
    // Products without stock tracking are left out rather than shown as empty.
    lowStock: products
      .filter((product) => product.inStock !== null && product.inStock < LOW_STOCK)
      .slice(0, 5),
    recentOrders: orders.slice(0, 5),
  };
}

const Panel = ({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col rounded-lg border bg-background">
    <div className="flex items-center justify-between border-b px-5 py-4">
      <h3 className="font-manrope text-base font-bold text-foreground">{title}</h3>
      {href && (
        <Button asChild variant="link" size="sm">
          <Link href={href}>
            View all
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      )}
    </div>
    <div className="flex-1 p-5">{children}</div>
  </section>
);

const ListSkeleton = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 4 }, (_, index) => (
      <Skeleton key={index} className="h-10 w-full" />
    ))}
  </div>
);

const Empty = ({ children }: { children: React.ReactNode }) => (
  <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>
);

const DashboardOverview = () => {
  const { data: user } = useMe();
  const products = useAdminProducts(OVERVIEW_PRODUCT_QUERY);
  const orders = useAdminOrders();

  const stats = useMemo(
    () => getStats(products.data?.data ?? [], orders.data ?? []),
    [products.data, orders.data],
  );
  const largestCategory = stats.topCategories[0]?.[1] ?? 1;
  const loadError = products.error ?? orders.error;

  return (
    <>
      <PageHeader
        title={`Welcome back${user ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Here is what is happening in your store."
      />

      {loadError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{loadError.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatPrice(stats.revenue)}
          hint={`From ${stats.deliveredCount} delivered orders`}
          icon={DollarSign}
          isLoading={orders.isPending}
        />
        <StatCard
          label="Total Orders"
          value={orders.data?.length ?? 0}
          hint={`${stats.customerCount} customers`}
          icon={ShoppingBag}
          isLoading={orders.isPending}
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingCount}
          hint="Waiting for delivery"
          icon={Clock}
          isLoading={orders.isPending}
        />
        <StatCard
          label="Products"
          value={products.data?.meta.total ?? 0}
          hint={`${stats.categoryCount} categories`}
          icon={Package}
          isLoading={products.isPending}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel title="Recent Orders" href="/dashboard/orders">
            {orders.isPending ? (
              <ListSkeleton />
            ) : stats.recentOrders.length === 0 ? (
              <Empty>No orders yet.</Empty>
            ) : (
              <ul className="divide-y">
                {stats.recentOrders.map((order) => (
                  <li key={order.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatOrderId(order.id)} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                    <span className="w-24 text-right text-sm font-semibold">{formatPrice(order.totalAmount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="Products by Category" href="/dashboard/products">
          {products.isPending ? (
            <ListSkeleton />
          ) : stats.topCategories.length === 0 ? (
            <Empty>No products yet.</Empty>
          ) : (
            <ul className="flex flex-col gap-4">
              {stats.topCategories.map(([category, count]) => (
                <li key={category} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">
                      <CategoryName slug={category} />
                    </span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-fill-thumbnail">
                    <div
                      className="h-full w-(--bar-width) rounded-full bg-brand"
                      style={{ "--bar-width": `${(count / largestCategory) * 100}%` } as React.CSSProperties}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Low Stock" href="/dashboard/products">
          {products.isPending ? (
            <ListSkeleton />
          ) : stats.lowStock.length === 0 ? (
            <Empty>No tracked product is below {LOW_STOCK} in stock.</Empty>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {stats.lowStock.map((product) => (
                <li key={product.id} className="flex items-center gap-3 rounded-md border p-3">
                  <ProductThumb src={product.image} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-destructive">
                      {product.inStock ? `${product.inStock} left` : "Out of stock"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
};

export default DashboardOverview;
