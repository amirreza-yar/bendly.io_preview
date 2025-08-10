import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Header } from '@/components/dashboard/header'
import {
  OrderSpecificationAccordion,
  OrderSummeryAccordion,
} from '@/components/dashboard/order/accordion'
import { OrderStatusBadge } from '@/components/dashboard/order/badge'
import {
  ProgressionObject,
  RejectedProgressionObject,
} from '@/components/dashboard/order/progressionObject'
import { formatDate, formatDateTime, formatDateWithDay } from '@/components/dashboard/order/utils'
import { Button } from '@/components/uikit/buttons/button'
import {
  ChevronDown,
  Delivery,
  Info,
  InProgress,
  NotProgressed,
  Phone,
  ProfileNav,
  ProgressChecked,
  WareHouse,
} from '@/components/uikit/icons'
import { Separator } from '@/components/uikit/separator'
import { Order } from '@/types/orders/orderType'
import { orders, replacementRequests } from '@/utilities/demo_datas/demoOrderData'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type OrderDetailsProp = {
  params: Promise<{
    orderId: number
  }>
}

export default async function OrderDetails({ params: paramsPromise }: OrderDetailsProp) {
  const { orderId } = await paramsPromise

  const order = orders.find((ord: Order) => ord.orderId === Number(orderId))

  if (!order) {
    notFound()
  }
  return (
    <>
      <Header title="Order Details" returnHref="/dashboard/orders" />
      <ContentWrapper className="bg-surface-page-body px-0 pb-4 no-scrollbar">
        <div className="grid gap-2">
          <div className="grid gap-2 bg-white p-4">
            <div className="flex items-center justify-between label-small pb-1">
              <p className="text-subtitle">Order Status</p>
              <span className="text-heading">
                <OrderStatusBadge status={order.orderStatus} />
              </span>
            </div>
            <div className="flex items-center justify-between label-small">
              <p className="text-subtitle">Order Number</p>
              <span className="text-heading">{order.orderId}</span>
            </div>
            <div className="flex items-center justify-between label-small">
              <p className="text-subtitle">Order Date</p>
              <span className="text-heading">{formatDateTime(order.orderDateTime)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between label-small">
              <p className="text-subtitle">Job Ref</p>
              <span className="text-heading">JR-{order.jobRefrence.code}</span>
            </div>
            {order.jobRefrence.projectName && (
              <div className="flex items-center justify-between label-small">
                <p className="text-subtitle">Project Name</p>
                <span className="text-heading">{order.jobRefrence.projectName}</span>
              </div>
            )}
          </div>

          {order.orderStatus !== 'Rejected' && (
            <div className="grid gap-2 bg-white p-4">
              {order.deliveryType === 'delivery' ? (
                <h6 className="pb-4">Delivery Information</h6>
              ) : (
                <h6 className="pb-4">Pickup Information</h6>
              )}
              <p className="label-small text-subtitle pb-1">
                {order.deliveryType === 'delivery' ? 'Delivery to:' : 'Pickup at:'}
              </p>
              {order.deliveryType === 'delivery'
                ? (() => {
                    const { address } = order
                    return (
                      <div className="flex items-center justify-start gap-1 label-small [&_svg]:size-4">
                        <Delivery />
                        <span className="text-heading">
                          {address.streetAddress}, {address.suburb}, {address.state},{' '}
                          {address.postcode}
                        </span>
                      </div>
                    )
                  })()
                : (() => {
                    const { pickupInfo } = order
                    return (
                      <>
                        <div className="flex items-start justify-start gap-2 label-small [&_svg]:size-4">
                          <WareHouse />
                          <span className="text-heading grid gap-1">
                            {pickupInfo.streetAddress}, {pickupInfo.suburb}, {pickupInfo.state},{' '}
                            {pickupInfo.postcode}
                            <p className="label-small">{order.pickupInfo.description}</p>
                          </span>
                        </div>
                      </>
                    )
                  })()}
              <div className="flex items-center justify-start gap-1 label-small [&_svg]:size-4">
                <ProfileNav />
                <span className="text-subtitle">
                  {order.recipientInfo.recipientName} {order.recipientInfo.recipientMobile}
                </span>
              </div>
              <div className="flex items-center justify-between label-small">
                <p className="text-subtitle">Delivery Date</p>
                <span className="text-heading">{formatDateWithDay(order.deliveryDate)}</span>
              </div>
              <div className="flex items-center justify-between label-small">
                <p className="text-subtitle">Delivery ID</p>
                {order.orderProgress !== 'Order Received' ? (
                  <span className="text-heading">{order.deliveryId}</span>
                ) : (
                  <span className="text-heading">Generated when order approved</span>
                )}
              </div>
              {order.deliveryType === 'delivery' &&
                (() => {
                  const { driverInfo } = order
                  return (
                    <>
                      {order.orderProgress === 'Ready' ||
                      order.orderProgress === 'In Production' ||
                      order.orderProgress === 'Completed' ? (
                        <>
                          <div className="flex items-center justify-between label-small">
                            <p className="text-subtitle">Driver Information</p>
                            <span className="text-heading">{driverInfo.name}</span>
                          </div>

                          {order.orderProgress !== 'Completed' && (
                            <div className="flex justify-end items-center pt-1">
                              <Link
                                href={`tel:${driverInfo.mobile}`}
                                className="flex gap-2 items-center text-xs/[17px] font-semibold rounded-md py-2 px-4 border-1 border-border-default"
                              >
                                <Phone className="size-5" />
                                Call Driver
                              </Link>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center justify-between label-small">
                          <p className="text-subtitle">Driver Information</p>
                          <span className="text-heading">Shown when order</span>
                        </div>
                      )}
                    </>
                  )
                })()}
            </div>
          )}

          {order.orderProgress === 'Completed' &&
            (() => {
              const req = replacementRequests.find((req) => order.orderId === req.order.orderId)

              if (req) {
                return (
                  <div className="grid gap-4 bg-white p-4">
                    <h6>Post-Delivery Actions</h6>
                    <div className="flex items-start gap-3 p-3 rounded-md body-small bg-surface-info-subtle text-primary">
                      <Info className="size-5" />
                      <p>
                        You have submitted a replacement request for this order on{' '}
                        {formatDateTime(req.requestDateTime)} <br /> Status: {req.requestProgress}
                      </p>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div className="grid gap-2 bg-white p-4">
                    <h6>Post-Delivery Actions</h6>
                    <p className="body-small text-body">
                      Something wrong with your delivery? Request a replacement easily.
                    </p>
                    <Link
                      className="w-full"
                      href={`/dashboard/orders/${orderId}/replacement-request`}
                    >
                      <Button variant="secondary" className="mt-2 w-full">
                        Request Replacement
                      </Button>
                    </Link>
                  </div>
                )
              }
            })()}

          <div className="grid gap-2 bg-white p-4">
            <h6 className="pb-4">Order Progress</h6>
            {order.orderStatus !== 'Rejected' ? (
              <ProgressionObject progress={order.orderProgress} />
            ) : (
              <>
                <RejectedProgressionObject progress={order.orderProgress} />
                <Separator className="my-2 mt-1" />
                <p className="label-small text-subtitle">Reasons for Reject:</p>
                <span className="label-small text-body">{order.rejectionDesc}</span>
              </>
            )}
          </div>

          <div className="grid gap-2 bg-white p-4 pb-0">
            <h6 className="pb-6">Order Specifications</h6>
            <OrderSpecificationAccordion flashings={order.flashings} />
          </div>

          {order.orderStatus !== 'Rejected' && (
            <div className="grid gap-2 bg-white p-4">
              <h6 className="pb-4">Order Summary</h6>
              <OrderSummeryAccordion flashings={order.flashings} />
              <Separator className="mb-2" />
              <div className="grid gap-4 pr-8">
                {order.deliveryType === 'delivery' && (
                  <div className="flex items-center justify-between">
                    <span className="label-small grid">
                      Delivery
                      <p className="caption-small text-subtitle">Available from 2 business days</p>
                    </span>
                    <p className="label-small text-success">${order.deliveryCost.toFixed(2)}</p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="label-small">GST</span>
                  <p className="label-small text-success">${order.GST.toFixed(2)}</p>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between pr-8">
                <span className="label-regular">Total</span>
                <p className="label-regular text-success">
                  ${order.paymentHistory.total.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <div className="grid bg-white gap-2 p-4">
            <h6>Payment History</h6>
            <div className="grid gap-3 pt-4">
              <div className="flex items-center justify-between">
                <p className="label-small text-subtitle">Total</p>
                <p className="label-small text-heading">{order.paymentHistory.total.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="label-small text-subtitle">Payment Date</p>
                <p className="label-small text-heading">
                  {formatDateTime(order.paymentHistory.date)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="label-small text-subtitle">Transaction ID</p>
                <p className="label-small text-heading">{order.paymentHistory.transactionId}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="label-small text-subtitle">Total</p>
                <p className="label-small text-heading">{order.paymentHistory.via}</p>
              </div>
            </div>
          </div>

          {order.orderProgress !== 'Completed' && (
            <div className="grid bg-white p-4 gap-6">
              <h6>Need Help?</h6>
              <div className="grid gap-4">
                <Link
                  href="tel:+9876543210"
                  className="flex gap-2 items-center justify-center text-xs/[17px] font-semibold rounded-md py-2 px-4 border-1 border-border-default"
                >
                  <Phone className="size-5" />
                  Call Support
                </Link>
                <Link
                  href="mailto:name@domain.com"
                  className="flex gap-2 items-center justify-center text-xs/[17px] font-semibold rounded-md py-2 px-4 border-1 border-border-default"
                >
                  <Phone className="size-5" />
                  Send Mail
                </Link>
                <p className="caption-small text-center pt-2">Support hours: Mon-Fri 8AM-6PM EST</p>
              </div>
            </div>
          )}
        </div>
      </ContentWrapper>
    </>
  )
}
