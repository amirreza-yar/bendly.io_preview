"use client";

import { Button } from "../ui/button";

export default function OrderDeliveryTypeHeader({
  deliveryType,
}: {
  deliveryType: string;
}) {
  return (
    <div className="px-4 flex justify-center pb-2 py-4 md:py-6">
      <div className="w-full sm:w-130 border rounded-md p-1 grid grid-cols-2 gap-1">
        <Button
          size="sm"
          className="text-xs h-8 rounded-md"
          variant={deliveryType === "pickup" ? "ghost" : "default"}
        >
          Delivery
        </Button>
        <Button
          size="sm"
          className="text-xs h-8 rounded-md"
          variant={deliveryType === "pickup" ? "default" : "ghost"}
        >
          Pickup
        </Button>
      </div>
    </div>
  );
}
