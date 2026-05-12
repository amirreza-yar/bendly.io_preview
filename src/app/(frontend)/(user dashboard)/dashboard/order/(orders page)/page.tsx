import { Orders } from "@/components/icons";
import { OrderCard } from "@/components/order/order-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios";
import { Order } from "@/types/api";
import { cookies } from "next/headers";

const createOrderURI: (query?: string) => string = (query) => {
  if (query) {
    return `/a/order?search=${query}`;
  } else {
    return "/a/order/";
  }
};

const onFetchOrders: (query?: string) => Promise<{
  ok: boolean;
  data: Order[] | [];
}> = async (query) => {
  "use server";

  try {
    const accessToken = (await cookies()).get("auth-jwt")?.value;

    const res = await api.get(createOrderURI(query), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { ok: true, data: res.data.results as Order[] };
  } catch {
    return { ok: false, data: [] };
  }
};

const getOrdersByTab: (
  orders: Order[] | [],
  tab: "active" | "completed",
) => Order[] = (orders, tab) => {
  if (tab === "active") {
    return orders?.filter((ord) =>
      ["pending", "in_progress", "ready"].includes(ord.status),
    );
  } else {
    return orders?.filter((ord) =>
      ["completed", "cancelled", "rejected"].includes(ord.status),
    );
  }
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; q?: string }>;
}) {
  const activeTab = (await searchParams).type ?? "active";
  const query = (await searchParams).q ?? "";

  const { data: orders } = await onFetchOrders(query);

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

  const groupedOrders = getOrdersByTab(
    orders,
    activeTab as "active" | "completed",
  );

  if (groupedOrders.length === 0) {
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Orders />
          </EmptyMedia>
          {!query ? (
            <EmptyTitle>
              No {activeTab === "active" ? "Active" : "Completed"} Orders Yet
            </EmptyTitle>
          ) : (
            <EmptyTitle>No orders found</EmptyTitle>
          )}
          {!query ? (
            <EmptyDescription className="max-w-xs text-pretty">
              {activeTab === "active"
                ? "Start designing your first flashing"
                : "Order will be shown here when completed"}
            </EmptyDescription>
          ) : (
            <EmptyDescription className="max-w-xs text-pretty">
              Try another keyword or adjust your search
            </EmptyDescription>
          )}
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <ScrollArea className="h-full">
        <div className="grid md:grid-cols-2 gap-2 md:gap-3 pb-4 px-4 sm:px-6">
          {groupedOrders?.map((ord) => (
            <OrderCard order={ord} key={ord.id} />
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
