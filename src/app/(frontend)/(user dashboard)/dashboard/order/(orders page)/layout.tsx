import BottomNav from "@/components/dashboard/bottom-nav";
import { UILayoutBackground } from "@/components/main";
import OrdersFiltersControlHeader from "@/components/order/orders-filters-header";
import OrdersTabs from "@/components/order/orders-tabs";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default async function OrdersLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <UILayoutBackground />
      <div className="fixed top-0 w-full">
        <h6 className="absolute top-5 left-5 text-primary-foreground">
          Orders
        </h6>

        <Button
          variant="ghost"
          size="icon-lg"
          className="absolute right-2 top-2 text-primary-foreground hover:bg-transparent hover:text-primary-light"
          asChild
        >
          <Link href="/dashboard/order/search">
            <Search className="size-6" />
          </Link>
        </Button>
      </div>
      <div className="fixed top-16 sm:top-16 w-full bottom-20 md:bottom-25 sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg pt-4 pb-0! h-full shadow-md">
          <div className="h-full gap-2 flex flex-col">
            <OrdersTabs />
            <OrdersFiltersControlHeader />
            <div className="flex-1 min-h-0">{children}</div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
