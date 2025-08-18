'use client'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Footer } from '@/components/dashboard/footer'
import { Header } from '@/components/dashboard/header'
import { NewOrderSummaryAccordion } from '@/components/dashboard/order/accordion'
import { AlertModal } from '@/components/uikit/alertModal'
import { Button } from '@/components/uikit/buttons/button'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import { Carousel, CarouselContent, CarouselItem } from '@/components/uikit/carousel'
import DividerWithText from '@/components/uikit/dividerWithText'
import { Drawer } from '@/components/uikit/drawer'
import {
  ChevronRight,
  Delivery,
  Magnifier,
  MapMarker,
  Plus,
  ProfileNav,
  XIcon,
} from '@/components/uikit/icons'
import { Separator } from '@/components/uikit/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/uikit/tabs'
import { Textarea } from '@/components/uikit/textarea'
import { getJobRefById } from '@/lib/db/helpers/jobRefHelpers'
import {
  getFlashingsByOrderId,
  getOrderById,
  upsertPartialOrder,
} from '@/lib/db/helpers/orderHelpers'
import { StoredFlashing } from '@/types/flashingTypes'
import { DeliveryType, Specification, StoredOrder } from '@/types/orderTypes'
import { AvailableDatesRespose, PickupInfoResponse, PriceResponse } from '@/types/queryTypes'
import { fetchAvailableDates, fetchPickupInfo, fetchPrices } from '@/utilities/api/order'
import { getDayAbbrString, getDayMonthNumber } from '@/utilities/datetime'
import { cn } from '@/utilities/ui'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function DeliveryAndShipping() {
  const router = useRouter()
  const { orderId } = useParams<{ orderId: string }>()

  const order = getOrderById(Number(orderId))

  const jobReference = getJobRefById(order?.jobRefrence?.id ?? '')

  const flashings = getFlashingsByOrderId(Number(orderId))

  const [addAddressModal, setAddAddressModal] = useState<boolean>(false)
  const [deliveryTypeState, setDeliveryTypeState] = useState<DeliveryType>()
  const [isSelectDateDrawerOpen, setIsSelectDateDrawerOpen] = useState<boolean>(false)
  const [orderNotesInput, setOrderNotesInput] = useState<string>('')

  useEffect(() => {
    if (order) {
      setDeliveryTypeState(order.deliveryType)
    }
  }, [order])

  const flashingsMap = useMemo(() => {
    if (!flashings || !Array.isArray(flashings)) return new Map<string, any>()
    return new Map(flashings.map((f: any) => [f?.id, f]))
  }, [flashings])

  const { data: priceData } = useQuery<PriceResponse>({
    queryKey: ['flashings-prices', order?.id, flashingsMap],
    queryFn: () => fetchPrices(order, flashingsMap),
    enabled: !!order?.flashings && flashingsMap.size > 0,
  })

  const GST: number = priceData?.gst ?? 0
  const DELIVERY_COST: number = priceData?.deliveryCost ?? 0

  const { data: pickupInfoData } = useQuery<PickupInfoResponse>({
    queryKey: ['pickup-info'],
    queryFn: () => fetchPickupInfo(),
    enabled: !!order,
  })

  const PICKUP_DESC = pickupInfoData?.pickupDesc
  const PICKUP_ADDRESS = pickupInfoData?.pickupAddr

  const { data: availableDatesData } = useQuery<AvailableDatesRespose>({
    queryKey: ['available-dates'],
    queryFn: () => fetchAvailableDates(),
    enabled: !!order,
  })

  const AVAILABLE_DATES = availableDatesData?.availableDates
  const DELIVERY_DESC = availableDatesData?.deliveryDesc

  const augmentedFlashings = useMemo(() => {
    if (!order?.flashings) return []

    return order.flashings
      .map((flash) => {
        const found = flashingsMap.get(flash.id) ?? null
        const priceFound = priceData?.prices?.find((prc: any) => prc.id === flash.id)
        if (!found || !priceFound) return null

        const specMap = new Map(priceFound.specifications.map((s) => [s.id, s.cost]))

        return {
          ...found,
          code: flash.code,
          position: flash.position,
          specifications: flash.specifications?.map((spec) => ({
            ...spec,
            cost: specMap.get(spec.id) ?? 0,
          })),
        }
      })
      .filter(Boolean)
  }, [order?.flashings, flashingsMap, priceData])

  const totalCost = useMemo(() => {
    const grandTotal = augmentedFlashings.reduce((total, flash) => {
      const subtotal =
        flash.specifications?.reduce(
          (sum: number, spec: Specification) => sum + (spec.cost ?? 0),
          0,
        ) ?? 0
      return total + subtotal
    }, 0)

    return grandTotal
  }, [augmentedFlashings])

  const removeJobRefFromOrder = async () => {
    await upsertPartialOrder(Number(orderId), {
      address: undefined,
      jobRefrence: undefined,
      recipientInfo: undefined,
    })
  }

  const changeOrderDeliveryType = async (deliveryType: DeliveryType) => {
    if (
      deliveryType === 'delivery' &&
      !(
        order?.address?.streetAddress &&
        order.address?.state &&
        order.address?.suburb &&
        order.address?.postcode
      )
    ) {
      if (order?.jobRefrence) {
        setAddAddressModal(true)
      } else {
        await upsertPartialOrder(Number(orderId), {
          deliveryType: 'delivery',
        })
        setDeliveryTypeState(deliveryType)
      }
    } else if (deliveryType === 'pickup') {
      await upsertPartialOrder(Number(orderId), {
        deliveryType: 'pickup',
        address: {
          title: order?.address?.title ?? '',
          streetAddress: undefined,
          state: undefined,
          suburb: undefined,
          postcode: undefined,
        },
      })
      setDeliveryTypeState(deliveryType)
    }
  }

  const onSubmitShippingAndDelivery = () => {
    if (order?.jobRefrence && order.address && order.recipientInfo) {
      setIsSelectDateDrawerOpen(true)
    } else {
      toast('Please select a job reference and address')
    }
  }

  const onSubmitDeliveryDate = async (date: string) => {
    if (order?.deliveryType === 'pickup') {
      await upsertPartialOrder(Number(orderId), {
        deliveryDate: new Date(date).getTime(),
        pickupInfo: {
          desc: PICKUP_DESC!,
          address: PICKUP_ADDRESS!,
        },
        totalCost: totalCost * GST + totalCost,
        GST: totalCost * GST,
        flashingTotalCost: totalCost,
        notes: orderNotesInput,
      })
    } else {
      await upsertPartialOrder(Number(orderId), {
        deliveryDate: new Date(date).getTime(),
        totalCost: totalCost * GST + totalCost + DELIVERY_COST,
        deliveryCost: DELIVERY_COST,
        GST: totalCost * GST,
        flashingTotalCost: totalCost,
        deliveryDesc: DELIVERY_DESC,
        notes: orderNotesInput,
      })
    }

    router.push(`/o/${orderId}/pay`)
  }

  return (
    <>
      <Header title="Shipping & Delivery" returnHref={`/o/${orderId}/review`} />
      <ContentWrapper className="pt-14 pb-22 px-0 bg-surface-page-body">
        <div className="bg-white px-4 py-4">
          <div className="grid grid-cols-2 text-center rounded-md border-2 p-0.5 border-border-dark">
            <div
              className={cn(
                'rounded-md py-2.5 label-small',
                deliveryTypeState === 'delivery' ? 'bg-primary text-white' : 'text-body',
              )}
              onClick={() => changeOrderDeliveryType('delivery')}
            >
              Delivery
            </div>
            <div
              className={cn(
                'rounded-md py-2.5 label-small',
                deliveryTypeState === 'pickup' ? 'bg-primary text-white' : 'text-body',
              )}
              onClick={() => changeOrderDeliveryType('pickup')}
            >
              Pickup
            </div>
          </div>
        </div>
        <div className="grid gap-2">
          <div className="grid gap-1 pb-2 bg-white">
            <div className="grid gap-3 bg-white px-4">
              <div className="grid pb-2 pt-3">
                <h6>Job Reference</h6>
                {order?.jobRefrence && order.address && order.recipientInfo ? (
                  (() => {
                    const job = order?.jobRefrence
                    const addr = order?.address
                    const recp = order?.recipientInfo

                    return (
                      <div className="grid gap-1">
                        <div
                          data-slot="card"
                          className="grid gap-4 rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative mt-4"
                        >
                          <IconButton
                            onClick={removeJobRefFromOrder}
                            variant="ghost"
                            black
                            className="absolute top-0 right-0"
                          >
                            <XIcon className="size-5" />
                          </IconButton>
                          <div className="grid gap-1 label-regular">
                            <p>JR-{job?.code}</p>
                            <p>{job?.projectName}</p>
                          </div>
                          <div className="flex gap-2">
                            <MapMarker className="size-5" />
                            <div className="flex flex-col gap-1 truncate">
                              <>
                                <p className="label-regular">{addr?.title}</p>
                                {addr?.streetAddress &&
                                addr?.postcode &&
                                addr?.suburb &&
                                addr?.state ? (
                                  <p className="body-small">
                                    {addr?.streetAddress}, {addr?.suburb}, {addr?.state}{' '}
                                    {addr?.postcode}
                                  </p>
                                ) : (
                                  <p className="body-small">Self pickup - No Delivery Address</p>
                                )}
                              </>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <ProfileNav className="size-5" />
                            <div className="truncate">
                              <>
                                <p className="body-small">
                                  {recp.recipientName} - {recp.recipientMobile}
                                </p>
                              </>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/o/${orderId}/delivery-ship/j/${order?.jobRefrence?.id}?return=delivery-ship`}
                          className="justify-self-end pr-0"
                        >
                          <Button size="default" variant="ghost" className="pr-0">
                            Edit or Change Address
                            <ChevronRight className="size-5" />
                          </Button>
                        </Link>
                      </div>
                    )
                  })()
                ) : (
                  <>
                    <div className="grid gap-3">
                      <p className="subtitle-regular pb-2">
                        Choose an existing job reference or create a new one to organize this order
                      </p>

                      <Link
                        href={`/o/${orderId}/delivery-ship/j`}
                        className=" flex gap-2 item-center justify-center py-2.5 rounded-md border border-border-default font-semibold text-sm-m"
                      >
                        <Magnifier className="size-5" />
                        View And Search Job Reference
                      </Link>
                      <DividerWithText text="OR" />
                      <Link
                        href={
                          order?.deliveryType === 'delivery'
                            ? `/o/${orderId}/delivery-ship/j/add?return=delivery`
                            : `/o/${orderId}/delivery-ship/j/add-pickup`
                        }
                        className=" flex gap-2 item-start justify-center py-2.5 rounded-md border border-border-default font-semibold text-sm-m"
                      >
                        <Plus className="size-5" />
                        Create New Job Reference
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-3 py-4 px-4 bg-white">
            <h6>Order Notes</h6>
            <Textarea
              placeholder="Add an optional note (if needed)"
              className="px-4 py-3 resize-none min-h-21"
              maxLength={300}
              value={orderNotesInput}
              onChange={(val) => setOrderNotesInput(val.target.value)}
            />
          </div>
          <div className="grid gap-3 py-4 px-4 bg-white">
            <h6>Order Summary</h6>

            {order?.flashings && <NewOrderSummaryAccordion flashings={augmentedFlashings} />}
            {order?.deliveryType === 'delivery' && (
              <>
                <Separator />
                <div className="grid">
                  <div className="flex justify-between label-small pr-8">
                    <p>Delivery</p>
                    <p className="text-success">${DELIVERY_COST.toFixed(2)}</p>
                  </div>
                  <p className="caption-small text-subtitle">Available from 2 business days</p>
                </div>
              </>
            )}
            <Separator />
            <div className="flex justify-between label-small pr-8">
              <p>GST</p>
              <p className="text-success">${(totalCost * GST).toFixed(2)}</p>
            </div>
            <Separator />
            <div className="flex justify-between label-regular pr-8">
              <p>Total</p>
              <p className="text-success">
                $
                {order?.deliveryType === 'delivery'
                  ? (totalCost * GST + totalCost + DELIVERY_COST).toFixed(2)
                  : (totalCost * GST + totalCost).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </ContentWrapper>
      <Footer>
        <div className="flex items-center justify-between w-full">
          <h5>
            $
            {order?.deliveryType === 'delivery'
              ? (totalCost * GST + totalCost + DELIVERY_COST).toFixed(2)
              : (totalCost * GST + totalCost).toFixed(2)}
          </h5>
          <Button size="large" className="w-40" onClick={onSubmitShippingAndDelivery}>
            Schedule & Pay
          </Button>
        </div>
      </Footer>

      <AlertModal
        open={addAddressModal}
        title="Address Required for Delivery"
        description="You’ve switched from Pickup to Delivery, but no address is set for this job. Add an address now or stay with Pickup?"
        cancelButtonText="Stay with Pickup"
        actionButtonText="Add Address"
        actionButtonVariant="secondary"
        cancleButtonVariant="secondary"
        dismissible
        onAction={() => {
          router.push(
            `/o/${orderId}/delivery-ship/j/${order?.jobRefrence?.id}/${jobReference?.addresses?.find((addr) => addr.title === order?.address?.title)?.id}/add-address`,
          )
        }}
        onCancle={() => {
          setAddAddressModal(false)
        }}
      />

      <Drawer open={isSelectDateDrawerOpen} dismissible={false}>
        <div className="grid py-6 gap-4">
          <div className="flex justify-between pb-2 px-6">
            <h6>Select you {order?.deliveryType} date</h6>
            <XIcon
              onClick={() => {
                setIsSelectDateDrawerOpen(false)
              }}
              className="size-6"
            />
          </div>
          <div className="flex gap-2 items-center px-6">
            <Delivery className="size-6" />
            <p className="caption-regular">
              Please select your preferred {order?.deliveryType} date
            </p>
          </div>

          <Carousel
            opts={{
              align: 'start',
            }}
            className="w-full"
          >
            <CarouselContent className="ml-2 w-screen">
              {AVAILABLE_DATES?.map((date, index) => (
                <CarouselItem
                  key={index}
                  className="last:pr-6"
                  onClick={() => onSubmitDeliveryDate(date)}
                >
                  <div className="grid items-center text-center gap-1.5 rounded-md border border-border-default p-2">
                    <p className="label-small">{getDayAbbrString(date)}</p>
                    <p className="caption-small text-subtitle">{getDayMonthNumber(date)}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {order?.deliveryType === 'pickup' && (
            <p className="text-center caption-small">{PICKUP_DESC}</p>
          )}
        </div>
      </Drawer>
    </>
  )
}
