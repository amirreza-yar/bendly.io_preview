"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Filter } from "lucide-react";
import Link from "next/link";

export default function OrdersFiltersControlHeader() {
  const queries = useSearchParams();

  return (
    <div className="flex items-center gap-3 mx-4 sm:mx-8 pb-1 overflow-x-auto">
      <Button
        variant="outline"
        className="text-foreground border-border rounded-lg"
        size="sm"
        asChild
      >
        <Link href="/dashboard/order/filter">
          <Filter />
          Filters
        </Link>
      </Button>
      {/* <>
        {(orderFilters?.materials.length ?? 0) > 0 && (
          <Button
            variant="outline"
            className="text-foreground border-foreground bg-gray-light rounded-lg"
            size="sm"
            onClick={() => {
              filtersForm.resetField("materials");
              setOrderFilters((prev) => ({
                ...prev,
                materials: [],
              }));
            }}
          >
            <X />
            Material
          </Button>
        )}
      </>
      <>
        {(orderFilters?.price?.[0] > 100 ||
          orderFilters?.price?.[1] < 1000000) && (
          <Button
            variant="outline"
            className="text-foreground border-foreground bg-gray-light rounded-lg"
            size="sm"
            onClick={() => {
              filtersForm.resetField("price");
              setOrderFilters((prev) => ({
                ...prev,
                price: [100, 1000000],
              }));
            }}
          >
            <X />
            Price
          </Button>
        )}
      </>
      <>
        {(orderFilters?.due_date_range.from ||
          orderFilters?.due_date_range.to) && (
          <Button
            variant="outline"
            className="text-foreground border-foreground bg-gray-light rounded-lg"
            size="sm"
            onClick={() => {
              filtersForm.resetField("due_date_range");
              setOrderFilters((prev) => ({
                ...prev,
                due_date_range: {},
              }));
            }}
          >
            <X />
            Delivery Date
          </Button>
        )}
      </> */}
    </div>
  );
}
