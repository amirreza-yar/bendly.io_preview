import BackController from "@/components/back-controller";
import BottomNav from "@/components/dashboard/bottom-nav";
import LibraryHeader from "@/components/dashboard/library-header";
import { UILayoutBackground } from "@/components/main";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default async function TemplatesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <UILayoutBackground />
      <LibraryHeader />
      <div className="fixed top-16 sm:top-16 w-full bottom-20 md:bottom-25 sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg pt-4 pb-0! h-full shadow-md">
          {children}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
