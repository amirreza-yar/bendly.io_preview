import BottomNav from "@/components/dashboard/bottom-nav";
import OrdersHeaderWithSearch from "@/components/dashboard/orders-header";
import { UILayoutBackground } from "@/components/main";
import OrdersFiltersControlHeader from "@/components/order/orders-filters-header";
import OrdersTabs from "@/components/order/orders-tabs";
import { ReactNode } from "react";

export default async function OrdersLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <UILayoutBackground />
      <OrdersHeaderWithSearch />
      <div className="fixed top-16 sm:top-16 w-full bottom-20 md:bottom-25 sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg pt-4 pb-0! h-full shadow-md">
          <div className="h-full gap-2 flex flex-col">
            <OrdersTabs />
            {/* <OrdersFiltersControlHeader /> */}
            <div className="flex-1 min-h-0">{children}</div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
