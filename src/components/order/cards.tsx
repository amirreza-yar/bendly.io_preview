import {
  Box2,
  Building,
  ChevronRight,
  DateIcon,
  Delivery,
  Download,
  Edit,
  Remove,
  WareHouse,
  XIcon,
} from "@/components/icons";
import Link from "next/link";
import { OrderStatusBadge } from "./order-status-badge";
import { ReplacementRequest } from "@/types/orders/requestType";
import { formatDate, formatDateTime, formatPrice, formatStatus } from "./utils";
import { StoredOrderFlashing } from "@/types/orderTypes";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { StoredFlashing } from "@/types/flashingTypes";
import { cn } from "@/utilities/ui";
import FlashingSVG from "@/components/utils/flashingSVG";
import { Order } from "@/types/api";
import { AlertDialogContent } from "../ui/alert-dialog";

export function OrderCard({ order, ...props }: { order: Order }) {
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

export function RequestCard({ req, ...props }: { req: ReplacementRequest }) {
  return (
    <Link
      {...props}
      href={`/dashboard/orders/req/${req.requestId}`}
      className="grid gap-4 rounded-md bg-white border-1 border-border-default p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <p className="caption-regular text-subtitle">Request ID</p>
          <span className="label-regular text-heading">
            REQ-{req.requestId}
          </span>
        </div>
        <OrderStatusBadge status={req.requestStatus} />
      </div>
      <div className="grid gap-1">
        <div className="flex items-center justify-start gap-2 [&_svg]:size-4 text-body  label-small">
          <DateIcon />
          <span className="label-small">
            Delivery Date: {formatDateTime(req.requestDateTime)}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="grid auto-cols-max grid-flow-col content-center gap-2 [&_svg]:size-4 text-body label-small">
          <Box2 />
          <span className="rounded-xs border-1 border-border-default px-2 py-1">
            {req.requestPieces[0].material} / {req.requestPieces[0].color}
            <br />
            {req.requestPieces[0].quantity} pcs
          </span>
          {req.requestPieces.length > 1 && (
            <span className="flex items-center rounded-xs border-1 border-border-default px-2">
              +{req.requestPieces.length - 1}
            </span>
          )}
        </div>
        <ChevronRight />
      </div>
    </Link>
  );
}

export function NewOrderCard({
  flashing,
  onDeleteFlashing,
  onSaveFlashing,
  orderId,
  className,
  ...props
}: {
  flashing:
    | (StoredFlashing &
        Pick<StoredOrderFlashing, "code" | "position" | "specifications">)
    | any;
  onDeleteFlashing: (flashingId: string) => void;
  onSaveFlashing: (flashingId: string) => void;
  orderId: string;
  className?: string;
}) {
  if (!flashing) return;

  return (
    <div
      {...props}
      className={cn(
        "grid gap-2 bg-white p-3 rounded-xs border border-border-default",
        className,
      )}
    >
      {/* {flashing.material_data.type === "color" &&
      !flashing.start_crush_fold &&
      !flashing.end_crush_fold ? (
        <EditFlashingDrawer flashingId={flashing.id} orderId={orderId}>
          <div className="grid grid-cols-2 p-3 rounded-xs border border-border-default">
            <FlashingSVG
              flashing={flashing}
              className="pl-2 h-18"
              path3DOffsetCoeff={0.8}
            />
            <div className="grid gap-1">
              <Edit className="size-5 justify-self-end" />
              <p className="caption-small">
                Total Grith: {Math.round(flashing?.total_girth)} mm
              </p>
              <p className="caption-small">
                Tapered: {flashing.tapered ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </EditFlashingDrawer>
      ) : ( */}
      <Link
        href={`/f/canvas?flashingId=${flashing.id}`}
        className="grid grid-cols-2 p-3 rounded-xs border border-border-default bg-gray-50"
      >
        <FlashingSVG
          flashing={flashing}
          className="pl-2 h-18"
          path3DOffsetCoeff={0.8}
        />
        <div className="grid gap-1">
          <Edit className="size-5 justify-self-end" />
          <p className="caption-small">
            Total Grith: {flashing.total_girth.toFixed(0)} mm
          </p>
          <p className="caption-small">
            Tapered: {flashing.tapered ? "Yes" : "No"}
          </p>
        </div>
      </Link>
      {/* )} */}
      <Link
        href={`/f/material?flashingId=${flashing.id}`}
        className="flex justify-between items-start p-3 rounded-xs border border-border-default bg-gray-50"
      >
        <div className="grid gap-2">
          <p className="caption-small">
            Material: {flashing.material_data.name}
          </p>
          <p className="caption-small">
            {flashing.material_data.type === "color"
              ? `Color: ${flashing.material_data.label}`
              : `Thickness: ${flashing.material_data.label} mm`}
          </p>
        </div>
        <Edit className="justify-self-end size-5 mb-4" />
      </Link>
      <Link
        href={`/f/${flashing.id}/details?orderId=${orderId}`}
        className="grid gap-4 p-3 rounded-xs border border-border-default bg-gray-50"
      >
        <div className="flex justify-between items-start">
          <div className="grid gap-2">
            <p className="caption-small">
              Code: <span className="label-regular">{flashing.code}</span>
            </p>
            <p className="caption-small">
              Position:
              {flashing.position ? flashing.position : "Not provided"}
            </p>
          </div>
          <Edit className="justify-self-end size-5 mb-4" />
        </div>
        <div className="flex justify-between pr-11">
          <div className="grid gap-2">
            <p className="label-regular border-b border-gray-300 pb-1 pr-2">
              Quantity
            </p>
            {flashing?.specifications?.map((spec: any, index: number) => (
              <p key={index} className="caption-small">
                {spec.quantity} pcs
              </p>
            ))}
          </div>
          <div className="grid gap-2 pr-6">
            <p className="label-regular border-b border-gray-300 pb-1 pr-2">
              Length
            </p>
            {flashing?.specifications?.map((spec: any, index: number) => (
              <p key={index} className="caption-small">
                {spec.length} mm
              </p>
            ))}
          </div>
        </div>
      </Link>
      <div className="flex justify-end items-center py-2">
        <DeleteFlashingModalOnOrderReview
          deleteFlashing={() => onDeleteFlashing(flashing.id)}
        >
          <div className="flex label-regular items-center gap-2 px-4">
            Delete
            <Remove className="size-5" />
          </div>
        </DeleteFlashingModalOnOrderReview>
        <div className="flex label-regular items-center gap-2 pl-4 pr-2 opacity-40">
          PDF
          <Download className="size-5" />
        </div>
      </div>
    </div>
  );
}

export const DeleteFlashingModalOnOrderReview = ({
  deleteFlashing,
  children,
}: {
  deleteFlashing: () => void;
  children: ReactNode;
}) => {
  return (
    <AlertDialogPrimitive.Root data-slot="alert-dialog">
      <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild>
        {children}
      </AlertDialogPrimitive.Trigger>
      <AlertDialogContent className="font-roboto">
        <div data-slot="alert-dialog-header" className="flex flex-col gap-4">
          <AlertDialogPrimitive.Cancel className="absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6">
            <XIcon className="text-neutral-dark" />
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className="text-sm/[19px] font-semibold"
          >
            Delete Flashing
          </AlertDialogPrimitive.Title>

          <AlertDialogPrimitive.Description
            data-slot="alert-dialog-description"
            className="text-muted-foreground text-sm"
          >
            Are you sure you want to delete this Flashing This action cannot be
            undone.
          </AlertDialogPrimitive.Description>
        </div>
        <div
          data-slot="alert-dialog-footer"
          className="flex gap-4 justify-end pt-4"
        >
          <AlertDialogPrimitive.Action asChild>
            <Button variant="ghost">No</Button>
          </AlertDialogPrimitive.Action>

          <AlertDialogPrimitive.Cancel asChild>
            <Button variant="ghost" onClick={deleteFlashing}>
              Yes
            </Button>
          </AlertDialogPrimitive.Cancel>
        </div>
      </AlertDialogContent>
    </AlertDialogPrimitive.Root>
  );
};
