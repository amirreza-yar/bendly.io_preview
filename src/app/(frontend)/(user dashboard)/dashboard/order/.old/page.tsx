import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/custom-tabs";
import BottomNav from "@/components/dashboard/bottom-nav";
import api, { fetcher } from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
} from "@/components/main";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "@/components/icons";
import { useState } from "react";
import { cn } from "@/utilities/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Filter, X } from "lucide-react";
import useSWRInfinite from "swr/infinite";
import { useDebounce } from "use-debounce";
import { OrderContent, OrderFilterContent } from "@/components/order/content";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { Material, Order } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cookies } from "next/headers";
import Link from "next/link";

const onFetchMaterials: () => Promise<{
  ok: boolean;
  data?: Material[];
}> = async () => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.post(`/a/materials/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { ok: true, data: res.data as Material[] };
  } catch (error: any) {
    console.error(error, error.response.data);
    try {
      return { ok: false };
    } catch {
      return { ok: false };
    }
  }
};

const onFetchOrders: (query?: string) => Promise<{
  ok: boolean;
  data?: Order[];
}> = async (query) => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.post(`/a/order?${query}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { ok: true, data: res.data as Order[] };
  } catch (error: any) {
    console.error(error, error.response.data);
    try {
      return { ok: false };
    } catch {
      return { ok: false };
    }
  }
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const isOnActiveOrdersTab = (await searchParams).type === "active";

  const { data: materials } = await onFetchMaterials();
  const { data: orders } = await onFetchOrders();

  // const getKey = (pageIndex: number, previousPageData: any) => {
  //   if (previousPageData && !previousPageData.next) return null;

  //   const params = new URLSearchParams();

  //   params.set("page", String(pageIndex + 1));

  //   if (debouncedSearch) {
  //     params.set("search", debouncedSearch);
  //   }

  //   if (debouncedFilters?.materials?.length) {
  //     params.set("materials", debouncedFilters.materials.join(","));
  //   }

  //   if (debouncedFilters?.price?.length === 2) {
  //     const [min, max] = debouncedFilters.price;
  //     params.set("price_min", String(min));
  //     params.set("price_max", String(max));
  //   }

  //   if (debouncedFilters?.due_date_range?.from) {
  //     params.set(
  //       "due_from",
  //       debouncedFilters.due_date_range.from.toISOString(),
  //     );
  //   }

  //   if (debouncedFilters?.due_date_range?.to) {
  //     params.set("due_to", debouncedFilters.due_date_range.to.toISOString());
  //   }

  //   return `/a/order?${params.toString()}`;
  // };

  return (
    <>
      <UILayout className="pb-100">
        <div className="fixed top-1 sm:top-3 sm:px-4 w-full text-primary-foreground">
          <div className="transition-all flex items-center justify-between pl-4">
            <h6>Orders</h6>
            <Button
              variant="ghost"
              size="icon-lg"
              className="hover:bg-transparent hover:text-primary-light mr-5"
              asChild
            >
              <Link href="/dashboard/order/filter">
                <Search />
              </Link>
            </Button>
          </div>
        </div>
        <UILayoutContentWrapper className="top-0 sm:top-2 mt-15 pb-20 fixed">
          <UILayoutContent className="py-4 sm:py-9 px-0">
            <Tabs value={tabValue} onValueChange={setTabValue}>
              {false ? (
                <div className="px-4 sm:px-12 animate-pulse">
                  <div className="grid grid-cols-2 gap-1 p-1 h-10 border rounded-md">
                    <div className="bg-gray rounded-md" />
                    <div className="bg-gray rounded-md" />
                  </div>
                </div>
              ) : (
                tabValue !== "search-orders" && (
                  <TabsList className="mx-4 sm:w-100 sm:mx-auto">
                    <TabsTrigger value="active-orders">Active</TabsTrigger>
                    <TabsTrigger value="past-orders">Past</TabsTrigger>
                  </TabsList>
                )
              )}
              <div className="flex items-center gap-3 mx-4 sm:mx-8 pb-1 overflow-x-auto">
                {(!isMaterialsLoading && !isLoading) || true ? (
                  <>
                    <Button
                      variant="outline"
                      className="text-foreground border-border rounded-lg"
                      size="sm"
                      onClick={() => setTabValue("filter-orders")}
                    >
                      <Filter />
                      Filters
                    </Button>
                    <>
                      {(orderFilters?.materials.length ?? 0) > 0 && (
                        <Button
                          variant="outline"
                          className="text-foreground border-foreground bg-gray-light rounded-lg"
                          size="sm"
                          onClick={() => {
                            filtersForm.resetField("materials");
                            setOrderFilters((prev) => ({
                              ...prev,
                              materials: [],
                            }));
                          }}
                        >
                          <X />
                          Material
                        </Button>
                      )}
                    </>
                    <>
                      {(orderFilters?.price?.[0] > 100 ||
                        orderFilters?.price?.[1] < 1000000) && (
                        <Button
                          variant="outline"
                          className="text-foreground border-foreground bg-gray-light rounded-lg"
                          size="sm"
                          onClick={() => {
                            filtersForm.resetField("price");
                            setOrderFilters((prev) => ({
                              ...prev,
                              price: [100, 1000000],
                            }));
                          }}
                        >
                          <X />
                          Price
                        </Button>
                      )}
                    </>
                    <>
                      {(orderFilters?.due_date_range.from ||
                        orderFilters?.due_date_range.to) && (
                        <Button
                          variant="outline"
                          className="text-foreground border-foreground bg-gray-light rounded-lg"
                          size="sm"
                          onClick={() => {
                            filtersForm.resetField("due_date_range");
                            setOrderFilters((prev) => ({
                              ...prev,
                              due_date_range: {},
                            }));
                          }}
                        >
                          <X />
                          Delivery Date
                        </Button>
                      )}
                    </>
                  </>
                ) : (
                  <>
                    <Skeleton className="h-8 w-21" />
                    <Skeleton className="h-8 w-30" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-50" />
                  </>
                )}
              </div>
              <TabsContent value="active-orders" className="relative">
                {(() => {
                  const filteredOrders = orders?.filter(
                    (o: any) =>
                      o.status === "pending" ||
                      o.status === "in_progress" ||
                      o.status === "ready",
                  );

                  return (
                    <OrderContent
                      isLoading={isLoading}
                      order={filteredOrders}
                      hasMore={hasMore}
                      isLoadingMore={isLoadingMore}
                      loadMore={loadMore}
                    />
                  );
                })()}
              </TabsContent>
              <TabsContent value="past-orders" className="relative">
                {(() => {
                  const filteredOrders = orders?.filter(
                    (o: any) =>
                      o.status === "completed" ||
                      o.status === "cancelled" ||
                      o.status === "rejected",
                  );

                  return (
                    <OrderContent
                      isLoading={isLoading}
                      type="past"
                      order={filteredOrders}
                      hasMore={hasMore}
                      isLoadingMore={isLoadingMore}
                      loadMore={loadMore}
                    />
                  );
                })()}
              </TabsContent>

              <TabsContent value="search-orders" className="relative pt-1">
                <OrderContent
                  isLoading={isLoading}
                  type="search"
                  order={orders}
                  hasMore={hasMore}
                  isLoadingMore={isLoadingMore}
                  loadMore={loadMore}
                  heightClass="h-[calc(100vh-215px)] md:h-[calc(100vh-235px)]"
                  maxHeightClass="max-h-[calc(100vh-215px)] md:max-h-fit"
                />
              </TabsContent>
            </Tabs>
          </UILayoutContent>
        </UILayoutContentWrapper>
      </UILayout>

      <BottomNav />
    </>
  );
}
