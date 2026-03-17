import BottomNav from "@/components/dashboard/bottom-nav";
import {
  UILayout,
  UILayoutContent,
  UILayoutContentWrapper,
} from "@/components/main";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "@/components/icons";
import Link from "next/link";
import { ReactNode } from "react";

export default async function OrderDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <UILayout className="pb-100">
        <div className="fixed top-1 w-full text-primary-foreground">
          <div className="transition-all flex items-center pl-1 gap-3">
            <Button
              variant="ghost"
              size="icon-lg"
              className="hover:bg-transparent hover:text-primary-light"
              asChild
            >
              <Link href="/dashboard/order">
                <ArrowLeft />
              </Link>
            </Button>
            <h6>Order Review</h6>
          </div>
        </div>
        <UILayoutContentWrapper className="top-0 mt-15 pb-20 fixed">
          <UILayoutContent className="px-0 py-0">{children}</UILayoutContent>
        </UILayoutContentWrapper>
      </UILayout>

      <BottomNav />
    </>
  );
}
