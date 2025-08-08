import { Badge } from '@/components/uikit/badge'
import {
  Box2,
  Building,
  ChevronRight,
  DateIcon,
  Delivery,
  WareHouse,
} from '@/components/uikit/icons'
import Link from 'next/link'
import { OrderStatusBadge } from './badge'
import { Flashing, Order } from '@/types/orders/orderType'
import { ReplacementRequest } from '@/types/orders/requestType'
import { formatDate, formatDateTime } from './utils'

export function OrderCard({ order, ...props }: { order: Order }) {
  console.log(order.flashings[0])
  return (
    <Link
      href={`/dashboard/orders/${order.orderId}`}
      {...props}
      className="grid gap-4 rounded-md bg-white border-1 border-border-default p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <p className="caption-regular text-subtitle">Order Number</p>
          <span className="label-regular text-heading">{order.orderId}</span>
        </div>
        <OrderStatusBadge status={order.orderStatus} />
      </div>
      <div className="grid gap-1">
        <div className="flex items-center justify-start gap-2 [&_svg]:size-4 text-body  label-small">
          <DateIcon />
          <span className="label-small">Delivery Date: {formatDate(order.deliveryDate)}</span>
        </div>
        <div className="flex items-center justify-start gap-2 [&_svg]:size-4 text-body  label-small">
          <Building />
          <span className="rounded-[900px] px-[10px] py-[2px] border-1 border-border-default">
            JR-{order.jobRefrence.code}
          </span>
          <span className="">{order.jobRefrence.projectName}</span>
        </div>
        {order.deliveryType === 'delivery'
          ? (() => {
              return (
                <div className="flex items-center justify-start gap-2 [&_svg]:size-4 text-body  label-small">
                  <Delivery />
                  <span>
                    {order.address.streetAddress}, {order.address.suburb}, {order.address.state},{' '}
                    {order.address.postcode}
                  </span>
                </div>
              )
            })()
          : (() => {
              return (
                <div className="flex items-center justify-start gap-2 [&_svg]:size-4 text-body  label-small">
                  <WareHouse />
                  <span>
                    {order.pickupInfo.streetAddress}, {order.pickupInfo.suburb},{' '}
                    {order.pickupInfo.state}, {order.pickupInfo.postcode}
                  </span>
                </div>
              )
            })()}
      </div>
      <div className="grid auto-cols-max grid-flow-col content-center gap-2 [&_svg]:size-4 text-body label-small">
        <Box2 />
        <span className="rounded-xs border-1 border-border-default px-2 py-1">
          {order.flashings[0].material} / {order.flashings[0].color}
          <br />
          {order.flashings[0].sepcifications.reduce(
            (sum: number, spec: any) => sum + spec.quantity,
            0,
          )}{' '}
          pcs
        </span>
        {order.flashings.length > 1 && (
          <span className="flex items-center rounded-xs border-1 border-border-default px-2">
            +{order.flashings.length - 1}
          </span>
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className="label-regular">${order.paymentHistory.total.toFixed(2)}</span>
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
