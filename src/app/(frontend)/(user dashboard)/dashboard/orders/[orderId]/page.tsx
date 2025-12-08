'use client'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Header } from '@/components/dashboard/header'
import { NewOrderSummaryAccordion } from '@/components/dashboard/order/accordion'
import { OrderStatusBadge } from '@/components/dashboard/order/badge'
import {
  ProgressionObject,
  RejectedProgressionObject,
} from '@/components/dashboard/order/progressionObject'
import { formatDateTime, formatDateWithDay } from '@/components/dashboard/order/utils'
import { Button } from '@/components/uikit/buttons/button'
import { Delivery, Info, Phone, ProfileNav, WareHouse } from '@/components/uikit/icons'
import { Separator } from '@/components/uikit/separator'
import { fetcher } from '@/lib/axios'
import { useGETOrderById } from '@/lib/db/helpers/orderHelpers'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { useMemo } from 'react'
import useSWR from 'swr'

function formatStatus(status: any) {
  const map: any = {
    pending: 'Pending',
    in_progress: 'In Progress',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    complete: 'Complete',
  }

  return map[status] || status
}

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>()

  const {
    data: order,
    isLoading,
    error,
  } = useSWR(`/d/order/${orderId}/`, fetcher, {
    onError: notFound,
  })

  return (
    <>
      <Header title="Order Details" returnHref="/dashboard/orders" />
      <ContentWrapper className="bg-surface-page-body md:bg-white pt-14 md:pt-18 px-0 md:px-4 pb-4 no-scrollbar">
        <div className="grid gap-2 grid-rows-[min-content_1fr] md:gap-4 md:grid-cols-2 [&>div]:md:border [&>div]:border-gray-200 [&>div]:md:bg-gray-50 md:[&>div]:rounded-md">
          <div className="grid gap-2 bg-white p-4">
            <div className="flex items-center justify-between label-small pb-1">
              <p className="text-subtitle">Order Status</p>
              <span className="text-heading">
                <OrderStatusBadge status={formatStatus(order?.status)} />
              </span>
            </div>
            <div className="flex items-center justify-between label-small">
              <p className="text-subtitle">Order Number</p>
              <span className="text-heading">{order?.id}</span>
            </div>
            <div className="flex items-center justify-between label-small">
              <p className="text-subtitle">Order Date</p>
              <span className="text-heading">{formatDateTime(order?.created_at)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between label-small">
              <p className="text-subtitle">Job Ref</p>
              <span className="text-heading">JR-{order?.job_reference?.code}</span>
            </div>
            {order?.job_reference?.project_name && (
              <div className="flex items-center justify-between label-small">
                <p className="text-subtitle">Project Name</p>
                <span className="text-heading">{order?.job_reference?.project_name}</span>
              </div>
            )}
          </div>

          {order?.status !== 'Rejected' && (
            <div className="grid gap-2 bg-white p-4">
              {order?.fulfillment?.type === 'delivery' ? (
                <h6 className="pb-4">Delivery Information</h6>
              ) : (
                <h6 className="pb-4">Pickup Information</h6>
              )}
              <p className="label-small text-subtitle pb-1">
                {order?.fulfillment?.type === 'delivery' ? 'Delivery to:' : 'Pickup at:'}
              </p>
              {order?.fulfillment?.type === 'delivery' ? (
                <div className="flex items-center justify-start gap-1 label-small [&_svg]:size-4">
                  <Delivery />
                  <span className="text-heading">{order?.fulfillment.address?.full_address}</span>
                </div>
              ) : (
                <div className="flex items-start justify-start gap-2 label-small [&_svg]:size-4">
                  <WareHouse />
                  <span className="text-heading grid gap-1">
                    {order?.job_reference?.full_address}
                    <p className="label-small">{order?.pickupInfo?.desc}</p>
                  </span>
                </div>
              )}
              <div className="flex items-center justify-start gap-1 label-small [&_svg]:size-4">
                <ProfileNav />
                <span className="text-subtitle">
                  {order?.fulfillment.address.recipient_name}{' '}
                  {order?.fulfillment.address.recipient_phone}
                </span>
              </div>
              <div className="flex items-center justify-between label-small">
                <p className="text-subtitle">Delivery Date</p>
                <span className="text-heading">
                  {formatDateWithDay(order?.fulfillment.date ?? 0)}
                </span>
              </div>
              {order?.status === 'in_progress' && (
                <div className="flex items-center justify-between label-small">
                  <p className="text-subtitle">Delivery ID</p>
                  <span className="text-heading">{order?.deliveryId}</span>
                </div>
              )}
              {order?.fulfillment?.type === 'delivery' &&
                order?.status === 'in_progress' &&
                (() => {
                  const driverInfo = order?.driverInfo
                  return (
                    <>
                      {order?.progress === 'Ready' ||
                      order?.progress === 'In Production' ||
                      order?.progress === 'Completed' ? (
                        <>
                          <div className="flex items-center justify-between label-small">
                            <p className="text-subtitle">Driver Information</p>
                            <span className="text-heading">{driverInfo?.name}</span>
                          </div>

                          {order?.progress !== 'Completed' && (
                            <div className="flex justify-end items-center pt-1">
                              <Link
                                href={`tel:${driverInfo?.mobile}`}
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
                          <span className="text-heading">Shown when order progressed</span>
                        </div>
                      )}
                    </>
                  )
                })()}
            </div>
          )}

          {order?.progress === 'Completed' &&
            (() => {
              // const req = replacementRequests.find((req) => order?.id === req.order?.id)
              const req = { requestDateTime: undefined, requestProgress: undefined }

              if (req !== undefined) {
                return (
                  <div className="grid gap-4 bg-white p-4">
                    <h6>Post-Delivery Actions</h6>
                    <div className="flex items-start gap-3 p-3 rounded-md body-small bg-surface-info-subtle text-primary">
                      <Info className="size-5" />
                      <p>
                        You have submitted a replacement request for this order on{' '}
                        {formatDateTime(req.requestDateTime ?? 0)} <br /> Status:{' '}
                        {req.requestProgress}
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
            {order?.status !== 'Rejected' ? (
              <ProgressionObject progress={order?.status} />
            ) : (
              <>
                <RejectedProgressionObject progress={order?.progress} />
                <Separator className="my-2 mt-1" />
                <p className="label-small text-subtitle">Reasons for Reject:</p>
                <span className="label-small text-body">{order?.rejectionDesc}</span>
              </>
            )}
          </div>

          {order?.status !== 'Rejected' && (
            <div className="grid gap-2 bg-white p-4">
              <h6 className="pb-4">Order Summary</h6>
              {order?.flashings && <NewOrderSummaryAccordion flashings={order?.flashings} />}
              <Separator className="mb-2" />
              <div className="grid gap-4 pr-8">
                {order?.fulfillment.type === 'delivery' && (
                  <>
                    <div>
                      <div className="flex justify-between label-small">
                        <p>Delivery</p>
                        <p className="text-success">
                          {order?.fulfillment?.method?._dm_type === 'freight'
                            ? 'Freight Collect'
                            : `$${order?.fulfillment.delivery_cost?.toFixed(2)}`}
                        </p>
                      </div>
                      <p className="caption-small text-subtitle">
                        {order?.fulfillment?.method?._dm_type !== 'freight'
                          ? 'Factory will deliver your order'
                          : 'Order delivered via freight transport'}
                      </p>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="label-small">GST</span>
                  <p className="label-small text-success">
                    $
                    {(
                      (order?.payment_history?.flashings_cost +
                        order?.payment_history?.delivery_cost) *
                      order?.payment_history?.gst
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between pr-8">
                <span className="label-regular">Total</span>
                <p className="label-regular text-success">
                  ${order?.payment_history?.amount.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <div className="grid bg-white gap-2 p-4">
            <h6>Payment History</h6>
            <div className="grid gap-3 pt-4">
              <div className="flex items-center justify-between">
                <p className="label-small text-subtitle">Total</p>
                <p className="label-small text-heading">
                  {order?.payment_history?.amount.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="label-small text-subtitle">Payment Date</p>
                <p className="label-small text-heading">
                  {formatDateTime(order?.payment_history?.date ?? 0)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="label-small text-subtitle">Transaction ID</p>
                <p className="label-small text-heading">{order?.payment_history?.transaction_id}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="label-small text-subtitle">Via</p>
                <p className="label-small text-heading">{order?.payment_history?.method}</p>
              </div>
            </div>
          </div>

          {order?.progress !== 'Completed' && (
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
