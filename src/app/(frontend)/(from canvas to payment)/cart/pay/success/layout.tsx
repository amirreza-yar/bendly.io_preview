import BackController from "@/components/back-controller";
import BottomNav from "@/components/dashboard/bottom-nav";
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
      <div className="fixed z-20 top-24 w-full bottom-4 sm:px-8 px-4 max-w-150 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg pb-0! h-fit shadow-md relative">
          {children}
        </div>
      </div>
      <BottomNav />
      <div className="backdrop-blur-xs fixed w-screen h-screen" />
    </>
  );
}
