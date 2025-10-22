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
} from '@/components/uikit/icons'
import Link from 'next/link'
import { OrderStatusBadge } from './badge'
import { Flashing, Order } from '@/types/orders/orderType'
import { ReplacementRequest } from '@/types/orders/requestType'
import { formatDate, formatDateTime } from './utils'
import { StoredOrder, StoredOrderFlashing } from '@/types/orderTypes'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { AlertDialogContent } from '@/components/uikit/alertModal'
import { Button } from '@/components/uikit/buttons/button'
import { ReactNode } from 'react'
import { StoredFlashing } from '@/types/flashingTypes'
import { EditFlashingDrawer } from '@/components/dashboard/order/drawers'
import { cn } from '@/utilities/ui'
import FlashingSVG from '@/components/utils/flashingSVG'

export function OrderCard({ order, ...props }: { order: StoredOrder }) {
  return (
    <Link
      href={`/dashboard/orders/${order.id}`}
      {...props}
      className="grid gap-4 rounded-md bg-white border-1 border-border-default p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <p className="caption-regular text-subtitle">Order Number</p>
          <span className="label-regular text-heading">{order.id}</span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="grid gap-1">
        <div className="flex items-center justify-start gap-2 [&_svg]:size-4 text-body  label-small">
          <DateIcon />
          <span className="label-small">Delivery Date: {formatDate(order.deliveryDate ?? 0)}</span>
        </div>
        <div className="flex items-center justify-start gap-2 [&_svg]:size-4 text-body  label-small">
          <Building />
          <span className="rounded-[900px] px-[10px] py-[2px] border-1 border-border-default">
            JR-{order?.jobRefrence?.code}
          </span>
          <span className="">{order?.jobRefrence?.projectName}</span>
        </div>
        {order.deliveryType === 'delivery'
          ? (() => {
              return (
                <div className="flex items-center justify-start gap-2 [&_svg]:size-4 text-body  label-small">
                  <Delivery />
                  <span>
                    {order?.address?.streetAddress}, {order?.address?.suburb},{' '}
                    {order?.address?.state}, {order?.address?.postcode}
                  </span>
                </div>
              )
            })()
          : (() => {
              return (
                <div className="flex items-center justify-start gap-2 [&_svg]:size-4 text-body  label-small">
                  <WareHouse />
                  <span>
                    {order?.pickupInfo?.address.streetAddress}, {order?.pickupInfo?.address.suburb},{' '}
                    {order?.pickupInfo?.address.state}, {order?.pickupInfo?.address.postcode}
                  </span>
                </div>
              )
            })()}
      </div>
      <div className="grid auto-cols-max grid-flow-col content-center gap-2 [&_svg]:size-4 text-body label-small">
        <Box2 />
        <span className="rounded-xs border-1 border-border-default px-2 py-1">
          {order?.flashings?.[0].moreDetails?.material} /{' '}
          {order?.flashings?.[0].moreDetails?.color
            ? order?.flashings?.[0].moreDetails?.color.name
            : `${order?.flashings?.[0].moreDetails?.thickness?.thickness}mm`}
          <br />
          {order?.flashings?.[0].specifications?.reduce(
            (sum: number, spec: any) => sum + spec.quantity,
            0,
          )}{' '}
          pcs
        </span>
        {(order?.flashings?.length ?? 0) > 1 && (
          <span className="flex items-center rounded-xs border-1 border-border-default px-2">
            +{(order?.flashings?.length ?? 1) - 1}
          </span>
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className="label-regular">${order?.paymentHistory?.total.toFixed(2)}</span>
        <ChevronRight />
      </div>
    </Link>
  )
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
          <span className="label-regular text-heading">REQ-{req.requestId}</span>
        </div>
        <OrderStatusBadge status={req.requestStatus} />
      </div>
      <div className="grid gap-1">
        <div className="flex items-center justify-start gap-2 [&_svg]:size-4 text-body  label-small">
          <DateIcon />
          <span className="label-small">Delivery Date: {formatDateTime(req.requestDateTime)}</span>
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
  )
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
    | (StoredFlashing & Pick<StoredOrderFlashing, 'code' | 'position' | 'specifications'>)
    | undefined
  onDeleteFlashing: (flashingId: string) => void
  onSaveFlashing: (flashingId: string) => void
  orderId: string
  className?: string
}) {
  if (!flashing) return

  return (
    <div
      {...props}
      className={cn('grid gap-2 bg-white p-3 rounded-xs border border-border-default', className)}
    >
      {flashing.color && !flashing.startCrushFold && !flashing.endCrushFold ? (
        <EditFlashingDrawer flashingId={flashing.id} orderId={orderId}>
          <div className="grid grid-cols-2 p-3 rounded-xs border border-border-default">
            <FlashingSVG flashing={flashing} className="pl-2 h-18" path3DOffsetCoeff={0.8} />
            <div className="grid gap-1">
              <Edit className="size-5 justify-self-end" />
              <p className="caption-small">Total Grith: {flashing.totalGirth} mm</p>
              <p className="caption-small">Tapered: {flashing.tapered ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </EditFlashingDrawer>
      ) : (
        <Link
          href={`/f/${flashing.id}/edit/canvas?next=order&orderId=${orderId}`}
          className="grid grid-cols-2 p-3 rounded-xs border border-border-default"
        >
          <FlashingSVG flashing={flashing} className="pl-2 h-18" path3DOffsetCoeff={0.8} />
          <div className="grid gap-1">
            <Edit className="size-5 justify-self-end" />
            <p className="caption-small">Total Grith: {flashing.totalGirth} mm</p>
            <p className="caption-small">Tapered: {flashing.tapered ? 'Yes' : 'No'}</p>
          </div>
        </Link>
      )}
      <Link
        href={`/f/${flashing.id}/edit/material-properties?next=order&orderId=${orderId}`}
        className="flex justify-between items-start p-3 rounded-xs border border-border-default"
      >
        <div className="grid gap-2">
          <p className="caption-small">Material: {flashing.material}</p>
          <p className="caption-small">
            {flashing.color
              ? `Color: ${flashing.color.name}`
              : `Thickness: ${flashing.thickness?.thickness}mm`}
          </p>
        </div>
        <Edit className="justify-self-end size-5 mb-4" />
      </Link>
      <Link
        href={`/f/${flashing.id}/details?orderId=${orderId}`}
        className="grid gap-4 p-3 rounded-xs border border-border-default"
      >
        <div className="flex justify-between items-start">
          <div className="grid gap-2">
            <p className="caption-small">
              Code: <span className="label-regular">{flashing.code}</span>
            </p>
            <p className="caption-small">
              Position:
              {flashing.position ? flashing.position : 'Not provided'}
            </p>
          </div>
          <Edit className="justify-self-end size-5 mb-4" />
        </div>
        <div className="flex justify-between pr-11">
          <div className="grid gap-2">
            <p className="label-regular border-b pb-1 pr-2">Quantity</p>
            {flashing?.specifications?.map((spec, index) => (
              <p key={index} className="caption-small">
                {spec.quantity} pcs
              </p>
            ))}
          </div>
          <div className="grid gap-2 pr-6">
            <p className="label-regular border-b pb-1 pr-2">Length</p>
            {flashing?.specifications?.map((spec, index) => (
              <p key={index} className="caption-small">
                {spec.length} mm
              </p>
            ))}
          </div>
        </div>
      </Link>
      <div className="flex justify-end items-center">
        <DeleteFlashingModalOnOrderReview deleteFlashing={() => onDeleteFlashing(flashing.id)}>
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
  )
}

export const DeleteFlashingModalOnOrderReview = ({
  deleteFlashing,
  children,
}: {
  deleteFlashing: () => void
  children: ReactNode
}) => {
  return (
    <AlertDialogPrimitive.Root data-slot="alert-dialog">
      <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild>
        {children}
      </AlertDialogPrimitive.Trigger>
      <AlertDialogContent className="font-roboto">
        <div data-slot="alert-dialog-header" className="flex flex-col gap-4">
          <AlertDialogPrimitive.Cancel className="absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6">
            <XIcon className="text-neutral-dark" variant="secondary" />
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
            Are you sure you want to delete this Flashing This action cannot be undone.
          </AlertDialogPrimitive.Description>
        </div>
        <div data-slot="alert-dialog-footer" className="flex gap-4 justify-end pt-4">
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
  )
}
