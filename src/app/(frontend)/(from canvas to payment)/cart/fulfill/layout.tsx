import BackController from "@/components/back-controller";
import { UILayoutBackground } from "@/components/main";
import { ReactNode } from "react";

export default async function FulFillLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <UILayoutBackground />
      <div className="fixed top-0 w-full">
        <div className="flex items-center gap-2 p-3">
          <BackController target="/cart" asButton />

          <h6 className="text-primary-foreground">Shipping & Delivery</h6>
        </div>
      </div>
      <div className="fixed top-16 w-full bottom-4 sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg pb-0! h-full shadow-md relative">
          {children}
        </div>
      </div>
    </>
  );
}
