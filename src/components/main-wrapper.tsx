import BottomNav from "@/components/dashboard/bottom-nav";
import { ArrowLeft } from "@/components/icons";
import { UILayoutBackground } from "@/components/main";
import { Button } from "@/components/ui/button";
import { cn } from "@/utilities/ui";
import Link from "next/link";
import { ReactNode } from "react";

export default function MainWrapper({
  title,
  children,
  returnHref,
  showBottomNav = true,
  className,
}: {
  title: string;
  children: ReactNode;
  returnHref?: string;
  showBottomNav?: boolean;
  className?: string;
}) {
  return (
    <>
      <UILayoutBackground />
      <div className="fixed top-0 w-full">
        <div
          className={cn(
            "absolute flex items-center gap-2",
            returnHref ? "top-3 left-3" : "top-5 left-6",
          )}
        >
          {returnHref && (
            <Button
              variant="ghost"
              size="icon-lg"
              className="text-primary-foreground"
              asChild
            >
              <Link href={returnHref}>
                <ArrowLeft />
              </Link>
            </Button>
          )}
          <h6 className="text-primary-foreground">{title}</h6>
        </div>
      </div>
      <div
        className={cn(
          "fixed top-16 sm:top-16 w-full sm:px-8 px-4 max-w-200 left-1/2 -translate-x-1/2",
          showBottomNav ? "bottom-20 md:bottom-25" : "bottom-4 md:bottom-6",
        )}
      >
        <div className={cn("bg-background rounded-lg pb-0! h-full shadow-md", className)}>
          {children}
        </div>
      </div>
      {showBottomNav && <BottomNav />}
    </>
  );
}
