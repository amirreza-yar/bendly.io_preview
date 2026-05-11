import {
  Box2,
  Building,
  ChevronRight,
  DateIcon,
  Delivery,
  WareHouse,
} from "@/components/icons";
import Link from "next/link";
import { OrderStatusBadge } from "./order-status-badge";
import { formatDate, formatPrice, formatStatus } from "./utils";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/api";
import { ComponentProps } from "react";

export function OrderCard({
  order,
  ...props
}: { order: Order } & ComponentProps<"div">) {
  return (
    <div
      {...props}
      className="grid gap-4 rounded-lg bg-background text-foreground border px-4 pt-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-caption text-gray-darkest">Order</p>
          <span className="text-label">#{order.id}</span>
        </div>
        <OrderStatusBadge
          status={formatStatus(order.status, order.fulfillment.type)}
        />
      </div>
      <div className="space-y-1 text-label-sm [&_svg]:size-4 [&>div]:flex [&>div]:items-center [&>div]:gap-2">
        <div>
          <DateIcon />
          Delivery Date: {formatDate(order.fulfillment.date ?? 0)}
        </div>
        <div>
          <Building />
          <span className="rounded-full px-2.5 border">
            JR-{order?.job_reference?.code}
          </span>
          <span className="">{order?.job_reference?.project_name}</span>
        </div>
        {order.fulfillment.type === "delivery"
          ? (() => {
              return (
                <div>
                  <Delivery />
                  <span>{order?.fulfillment.address?.full_address}</span>
                </div>
              );
            })()
          : (() => {
              return (
                <div>
                  <WareHouse />
                  <span>
                    <span>No address - Self pickup</span>
                  </span>
                </div>
              );
            })()}
      </div>
      <div
        className={`flex gap-2 [&_svg]:size-4 text-caption-sm relative 
          [&>span]:rounded-sm [&>span]:border [&>span]:px-2 [&>span]:py-1 
          [&>span]:bg-gray-light rounded-sm [&>span]:border [&>span]:px-2 
          [&>span]:py-1 [&>span]:bg-gray-light`}
      >
        <Box2 className="mt-1" />
        <span className="max-w-[60%]">
          {order?.flashings?.[0].material_data.name} .{" "}
          {order?.flashings?.[0].material_data.label}
          <br />
          {order?.flashings?.[0].specifications?.reduce(
            (sum: number, spec: any) => sum + spec.quantity,
            0,
          )}{" "}
          pcs
        </span>
        {(order?.flashings?.length ?? 0) > 1 && (
          <span className="flex items-center">
            +{(order?.flashings?.length ?? 1) - 1} Item
          </span>
        )}
      </div>
      <div className="flex justify-between items-center -mt-2">
        <span className="text-label">
          {formatPrice(order?.payment_history?.amount)}
        </span>
        <Button variant="ghost" size="icon-lg" asChild>
          <Link href={`/dashboard/order/${order.id}`}>
            <ChevronRight className="size-5 -mr-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
