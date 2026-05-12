"use client";

import Link from "next/link";
import BackController from "../../back-controller";
import { Button } from "../../ui/button";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/utilities/ui";

export default function LibraryHeader() {
  const returnToCart = useSearchParams().get("return") === "cart";
  return (
    <div className="fixed top-0 w-full">
      <div className="absolute top-3 left-3 flex items-center gap-1">
        {returnToCart && <BackController target="/cart" asButton />}
        <h6
          className={cn(
            "text-primary-foreground",
            !returnToCart && "pt-2 pl-4",
          )}
        >
          Library
        </h6>
      </div>

      {!returnToCart && (
        <Button
          variant="ghost"
          size="icon-lg"
          className="absolute right-3 top-3 text-primary-foreground hover:bg-transparent hover:text-primary-light"
          asChild
        >
          <Link href="/dashboard/library/search?q=">
            <Search className="size-6" />
          </Link>
        </Button>
      )}
    </div>
  );
}
