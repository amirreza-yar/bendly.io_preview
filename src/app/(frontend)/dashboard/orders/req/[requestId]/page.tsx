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
  RejectedRequestProgressionObject,
  RequestProgressionObject,
} from '@/components/dashboard/order/progressionObject'
import {
  formatDate,
  formatDateTime,
  formatDateWithDay,
  groupByFlashing,
} from '@/components/dashboard/order/utils'
import { Button } from '@/components/uikit/buttons/button'
import {
  ChevronDown,
  ChevronRight,
  Delivery,
  InProgress,
  NotProgressed,
  Phone,
  ProfileNav,
  ProgressChecked,
  WareHouse,
} from '@/components/uikit/icons'
import { Separator } from '@/components/uikit/separator'
import { Order } from '@/types/orders/orderType'
import { ReplacementRequest } from '@/types/orders/requestType'
import { orders, replacementRequests } from '@/utilities/demoOrderData'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type RequestDetailsProp = {
  params: Promise<{
    requestId: number
  }>
}

export default async function RequestDetails({ params: paramsPromise }: RequestDetailsProp) {
  const { requestId } = await paramsPromise

  const replacementReq = replacementRequests.find(
    (req: ReplacementRequest) => req.requestId === Number(requestId),
  )

  if (!replacementReq) {
    notFound()
  }
  return (
    <>
      <Header title="Replacement Details" returnHref="/dashboard/orders" />
      <ContentWrapper className="bg-surface-page-body px-0 pb-4 no-scrollbar">
        <div className="grid gap-2">
          <div className="grid gap-2 bg-white p-4">
            <div className="flex items-center justify-between label-small pb-1">
              <p className="text-subtitle">Request Status</p>
              <span className="text-heading">
                <OrderStatusBadge status={replacementReq.requestStatus} />
              </span>
            </div>
            <div className="flex items-center justify-between label-small">
              <p className="text-subtitle">Request ID</p>
              <span className="text-heading">{replacementReq.requestId}</span>
            </div>
            <div className="flex items-center justify-between label-small">
              <p className="text-subtitle">Request Date</p>
              <span className="text-heading">{formatDateTime(replacementReq.requestDateTime)}</span>
            </div>
            <Link
              href={`/dashboard/orders/${replacementReq.order.orderId}`}
              className="grid gap-2 rounded-md border border-border-default mt-2 py-2"
            >
              <div className="flex items-center justify-between label-small px-2">
                <p className="text-subtitle">Order Number</p>
                <span className="text-heading">{replacementReq.order.orderId}</span>
              </div>
              <div className="flex items-center justify-between label-small px-2">
                <p className="text-subtitle">Order Date</p>
                <span className="text-heading">
                  {formatDateTime(replacementReq.order.orderDateTime || '')}
                </span>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between label-small px-2">
                <p className="text-subtitle">Job Ref</p>
                <span className="text-heading">JR-{replacementReq.order.jobRefrence?.code}</span>
              </div>
              {replacementReq.order.jobRefrence?.projectName && (
                <div className="flex items-center justify-between label-small px-2">
                  <p className="text-subtitle">Project Name</p>
                  <span className="text-heading">
                    {replacementReq.order.jobRefrence?.projectName}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-end px-2 pt-2 gap-2 text-primary">
                <p className="text-xs/[17px] font-semibold">View Order</p>
                <ChevronRight className="size-5" />
              </div>
            </Link>
          </div>

          {replacementReq.requestStatus !== 'Rejected' &&
            replacementReq.requestProgress !== 'Requested' &&
            (() => {
              const { order } = replacementReq
              const { address } = replacementReq.order
              return (
                <div className="grid gap-2 bg-white p-4">
                  {order.deliveryType === 'delivery' ? (
                    <h6 className="pb-4">Replacement Delivery Information</h6>
                  ) : (
                    <h6 className="pb-4">Replacement Pickup Information</h6>
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
                              {address?.streetAddress}, {address?.suburb}, {address?.state},{' '}
                              {address?.postcode}
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
                                {pickupInfo?.streetAddress}, {pickupInfo?.suburb},{' '}
                                {pickupInfo?.state}, {pickupInfo?.postcode}
                                <p className="label-small">{pickupInfo?.description}</p>
                              </span>
                            </div>
                          </>
                        )
                      })()}
                  <div className="flex items-center justify-start gap-1 label-small [&_svg]:size-4">
                    <ProfileNav />
                    <span className="text-subtitle">
                      {replacementReq.order.recipientInfo?.recipientName}{' '}
                      {replacementReq.order.recipientInfo?.recipientMobile}
                    </span>
                  </div>
                  <div className="flex items-center justify-between label-small">
                    <p className="text-subtitle">Replacement Delivery Date</p>
                    <span className="text-heading">
                      {formatDateWithDay(replacementReq.order.deliveryDate || '')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between label-small">
                    <p className="text-subtitle">Replacement Delivery ID</p>
                    {replacementReq.requestProgress !== 'Request Review' ? (
                      <span className="text-heading">{replacementReq.requestDeliveryId}</span>
                    ) : (
                      <span className="text-heading">Generated when order approved</span>
                    )}
                  </div>
                  {order.deliveryType === 'delivery' &&
                    (() => {
                      const { driverInfo } = order
                      return (
                        <>
                          {replacementReq.requestProgress === 'Ready' ||
                          replacementReq.requestProgress === 'In Production' ||
                          replacementReq.requestProgress === 'Completed' ? (
                            <>
                              <div className="flex items-center justify-between label-small">
                                <p className="text-subtitle">Driver Information</p>
                                <span className="text-heading">{driverInfo?.name}</span>
                              </div>

                              <div className="flex justify-end items-center pt-1">
                                <Link
                                  href={`tel:${driverInfo?.mobile}`}
                                  className="flex gap-2 items-center text-xs/[17px] font-semibold rounded-md py-2 px-4 border-1 border-border-default"
                                >
                                  <Phone className="size-5" />
                                  Call Driver
                                </Link>
                              </div>
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
              )
            })()}

          <div className="grid gap-2 bg-white p-4">
            <h6 className="pb-4">Order Progress</h6>
            {replacementReq.requestStatus !== 'Rejected' ? (
              <RequestProgressionObject progress={replacementReq.requestProgress} />
            ) : (
              <>
                <RejectedRequestProgressionObject progress={replacementReq.requestProgress} />
                <Separator className="my-2 mt-1" />
                <p className="label-small text-subtitle">Reasons for Reject:</p>
                <span className="label-small text-body">{replacementReq.rejectDesc}</span>
              </>
            )}
          </div>

          <div className="grid gap-4 bg-white p-4 pb-4">
            <h6 className="pb-2">Summary</h6>

            {groupByFlashing(replacementReq.requestPieces).map((flash, index) => {
              return (
                <div
                  key={index}
                  className="grid gap-y-2 items-center  border-b border-border-default pb-4"
                >
                  <div className="w-full flex justify-between items-start text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <span className="w-16 h-16 rounded-md border border-border-default" />
                      <p className="label-regular">
                        {flash.material} / {flash.color}
                      </p>
                    </div>
                  </div>
                  {flash.sepcifications.map((spec, index) => (
                    <div key={index} className="flex justify-between pl-19 pr-4">
                      <p className="caption-small">
                        {spec.quantity} pcs x {spec.length}mm
                      </p>
                      <p className="caption-small text-success">${spec.cost}</p>
                    </div>
                  ))}
                </div>
              )
            })}
            <div className="flex items-center justify-between ">
              <p className="label-small text-subtitle">Reasons for Replacement</p>
              <p className="label-small text-heading">{replacementReq.issue.title}</p>
            </div>
            <p className="body-small text-body">{replacementReq.description}</p>
          </div>

          {replacementReq.requestProgress !== 'Completed' && (
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
