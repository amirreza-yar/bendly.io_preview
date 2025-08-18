'use client'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Footer } from '@/components/dashboard/footer'
import { Header } from '@/components/dashboard/header'
import { PaymentMethodForm, PaymentMethodFormValues } from '@/components/dashboard/order/forms'
import { Button } from '@/components/uikit/buttons/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/uikit/carousel'
import { Drawer } from '@/components/uikit/drawer'
import { Delivery, Edit, MapMarker, ProfileNav, WareHouse, XIcon } from '@/components/uikit/icons'
import { Separator } from '@/components/uikit/separator'
import { getOrderById, upsertPartialOrder } from '@/lib/db/helpers/orderHelpers'
import { AvailableDatesRespose, PickupInfoResponse } from '@/types/queryTypes'
import { fetchAvailableDates, fetchPayOrder, fetchPickupInfo } from '@/utilities/api/order'
import { getDayAbbrString, getDayMonthNumber, getDayString } from '@/utilities/datetime'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function PaymentOptionPage() {
  const { orderId } = useParams<{ orderId: string }>()

  const order = getOrderById(Number(orderId))

  const recipient = order?.recipientInfo

  const [isSelectDateDrawerOpen, setIsSelectDateDrawerOpen] = useState<boolean>(false)

  const router = useRouter()

  const { data: availableDatesData } = useQuery<AvailableDatesRespose>({
    queryKey: ['available-dates'],
    queryFn: () => fetchAvailableDates(),
    enabled: !!order,
  })

  const AVAILABLE_DATES = availableDatesData?.availableDates

  const onSubmitDeliveryDate = async (date: string) => {
    await upsertPartialOrder(Number(orderId), {
      deliveryDate: new Date(date).getTime(),
    })

    setIsSelectDateDrawerOpen(false)
  }

  const onSubmitPay = async (data: PaymentMethodFormValues) => {
    const payResponse = await fetchPayOrder({ orderId: orderId, payVia: data.method })

    if (payResponse) {
      await upsertPartialOrder(Number(orderId), {
        paymentHistory: {
          id: payResponse.id,
          orderId: orderId,
          total: order?.totalCost!,
          date: payResponse.date,
          transactionId: payResponse.transactionId,
          via: payResponse.via,
        },
      })

      toast('Successful')

      router.push('/dashboard')
    }
  }

  return (
    <>
      <Header title="Payment Option" returnHref={`/o/${orderId}/delivery-ship`} />
      <ContentWrapper className="bg-surface-page-body px-0 pt-14 pb-23">
        <div className="grid gap-2">
          <div className="grid gap-2 bg-white px-4 pt-4 pb-2">
            {order?.deliveryType === 'delivery'
              ? (() => {
                  const address = order.address
                  return (
                    <>
                      <p className="label-regular pb-1">Deliver to</p>
                      <div className="flex items-start gap-2">
                        <MapMarker className="size-4 mt-0.5" />
                        <p className="body-small">
                          {address?.streetAddress}, {address?.suburb}, {address?.state}{' '}
                          {address?.postcode}
                        </p>
                      </div>
                    </>
                  )
                })()
              : (() => {
                  const pickupAddr = order?.pickupInfo?.address
                  const pickupDesc = order?.pickupInfo?.desc
                  return (
                    <>
                      <p className="label-regular pb-1">Deliver to</p>
                      <div className="flex items-start gap-2">
                        <MapMarker className="size-4 mt-0.5" />
                        <p className="body-small">
                          {pickupAddr?.streetAddress}, {pickupAddr?.suburb}, {pickupAddr?.state}{' '}
                          {pickupAddr?.postcode}
                          <br />
                          {pickupDesc}
                        </p>
                      </div>
                    </>
                  )
                })()}
            <div className="flex gap-2 items-center">
              <ProfileNav className="size-4 mb-0.5" />
              <p className="caption-small text-subtitle">
                {recipient?.recipientName} - {recipient?.recipientMobile}
              </p>
            </div>
            <Separator className="my-2" />
            {order?.deliveryType === 'delivery' ? (
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <p className="label-regular pb-1">Delivery Date</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Delivery className="size-4 mb-0.5" />
                      <p className="label-small">
                        {getDayString(order?.deliveryDate)} -{' '}
                        {getDayMonthNumber(order?.deliveryDate)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="default"
                      className="pr-0 pb-0"
                      onClick={() => setIsSelectDateDrawerOpen(true)}
                    >
                      <Edit className="size-5" />
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                <p className="label-regular pb-1">Pickup Date</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WareHouse className="size-4 mb-0.5" />
                    <p className="label-small">
                      {getDayString(order?.deliveryDate)} - {getDayMonthNumber(order?.deliveryDate)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="default"
                    className="pr-0 pb-0"
                    onClick={() => setIsSelectDateDrawerOpen(true)}
                  >
                    <Edit className="size-5" />
                    Change
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="grid gap-3 bg-white p-4">
            <div className="grid gap-4">
              <h6>Payment Summary</h6>
              <div className="flex items-center justify-between caption-small">
                <p>Flashing Total</p>
                <p className="text-success">${order?.flashingTotalCost?.toFixed(2)}</p>
              </div>
              {order?.deliveryType === 'delivery' && (
                <div className="flex items-start justify-between caption-small ">
                  <div className="flex-1 gap-0.5">
                    <p>Delivery</p>
                    <p className="text-subtitle">{order.deliveryDesc}</p>
                  </div>
                  <p className="text-success">${order.deliveryCost?.toFixed(2)}</p>
                </div>
              )}
              <div className="flex items-center justify-between label-small">
                <p>GST</p>
                <p className="text-success">${order?.GST?.toFixed(2)}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between label-regular">
              <p>Total</p>
              <p className="text-success">${order?.totalCost?.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid gap-3 bg-white p-4">
            <div className="grid gap-4">
              <h6>Choose a Payment Method</h6>
              <PaymentMethodForm onSubmitPay={onSubmitPay} />
            </div>
          </div>
        </div>
      </ContentWrapper>
      <Footer>
        <Button form="payment-method-form" type="submit" className="w-full">
          Pay ${order?.totalCost?.toFixed(2)}
        </Button>
      </Footer>

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
            <p className="text-center caption-small">{order.pickupInfo?.desc}</p>
          )}
        </div>
      </Drawer>
    </>
  )
}
