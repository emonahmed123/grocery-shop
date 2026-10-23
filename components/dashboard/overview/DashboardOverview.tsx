"use client";

import { ArrowRight, Clock, DollarSign, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

import StatCard from "@/components/dashboard/overview/StatCard";
import PageHeader from "@/components/dashboard/PageHeader";
import { CategoryName, ProductThumb } from "@/components/dashboard/products/productColumns";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useMe } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/assets";
import { formatDate, formatOrderId } from "@/lib/format";

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
  const { data: stats, error, isPending } = useDashboardStats();
  const topCategories = stats?.topCategories ?? [];
  const recentOrders = stats?.recentOrders ?? [];
  const lowStock = stats?.lowStock ?? [];
  const largestCategory = topCategories[0]?.count ?? 1;

  return (
    <>
      <PageHeader
        title={`Welcome back${user ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Here is what is happening in your store."
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatPrice(stats?.revenue ?? 0)}
          hint={`From ${stats?.deliveredOrders ?? 0} delivered orders`}
          icon={DollarSign}
          isLoading={isPending}
        />
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders ?? 0}
          hint={`${stats?.customerCount ?? 0} customers`}
          icon={ShoppingBag}
          isLoading={isPending}
        />
        <StatCard
          label="Pending Orders"
          value={stats?.pendingOrders ?? 0}
          hint="Waiting for delivery"
          icon={Clock}
          isLoading={isPending}
        />
        <StatCard
          label="Products"
          value={stats?.totalProducts ?? 0}
          hint={`${stats?.categoryCount ?? 0} categories`}
          icon={Package}
          isLoading={isPending}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel title="Recent Orders" href="/dashboard/orders">
            {isPending ? (
              <ListSkeleton />
            ) : recentOrders.length === 0 ? (
              <Empty>No orders yet.</Empty>
            ) : (
              <ul className="divide-y">
                {recentOrders.map((order) => (
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
          {isPending ? (
            <ListSkeleton />
          ) : topCategories.length === 0 ? (
            <Empty>No products yet.</Empty>
          ) : (
            <ul className="flex flex-col gap-4">
              {topCategories.map(({ category, count }) => (
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
          {isPending ? (
            <ListSkeleton />
          ) : lowStock.length === 0 ? (
            <Empty>No tracked product is below {stats?.lowStockLimit} in stock.</Empty>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {lowStock.map((product) => (
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
