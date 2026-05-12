import BottomNav from "@/components/dashboard/bottom-nav";
import { ArrowLeft } from "@/components/icons";
import { UILayoutBackground } from "@/components/main";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { ReactNode } from "react";

export default async function OrderDetailsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <UILayoutBackground />
      <div className="fixed top-0 w-full">
        <div className="flex items-center gap-2 absolute top-3 left-3 text-primary-foreground">
          <Button variant="ghost" size="icon-lg" asChild>
            <Link href="/dashboard/order">
              <ArrowLeft />
            </Link>
          </Button>

          <h6>Order Review</h6>
        </div>
      </div>
      <div className="fixed top-16 sm:top-16 w-full bottom-20 md:bottom-25 sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg pb-0! h-full shadow-md flex flex-col">
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">{children}</ScrollArea>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
