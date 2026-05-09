"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";

export default function OrdersTabs() {
  const isOnActiveOrdersTab = useSearchParams().get("type") === "completed";

  return (
    <div className="px-4 flex justify-center pb-2">
      <div className="w-full sm:w-130 border rounded-md p-1 grid grid-cols-2 gap-1">
        <Button
          size="sm"
          className="text-xs h-8 rounded-md"
          variant={isOnActiveOrdersTab ? "ghost" : "default"}
          asChild
        >
          <Link href="/dashboard/order">Active</Link>
        </Button>
        <Button
          size="sm"
          className="text-xs h-8 rounded-md"
          variant={isOnActiveOrdersTab ? "default" : "ghost"}
          asChild
        >
          <Link href="/dashboard/order?type=completed">Completed</Link>
        </Button>
      </div>
    </div>
  );
}
