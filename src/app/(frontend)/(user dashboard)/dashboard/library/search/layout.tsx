import BottomNav from "@/components/dashboard/bottom-nav";
import LibrarySearchHeader from "@/components/dashboard/library/library-search-header";
import { ArrowLeft } from "@/components/icons";
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
      {/* <LibrarySearchHeader /> */}

      <div className="fixed top-0 w-full">
        <div className="absolute top-3 left-3 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-lg"
            className="text-primary-foreground hover:bg-transparent hover:text-primary-light"
            asChild
          >
            <Link href="/dashboard/library">
              <ArrowLeft />
            </Link>
          </Button>
          <h6 className="text-primary-foreground">Find Templates</h6>
        </div>
      </div>

      <div className="fixed top-16 sm:top-16 w-full bottom-20 md:bottom-25 sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2">
        <div className="bg-background rounded-lg pt-4 pb-0! h-full shadow-md">
          {children}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
