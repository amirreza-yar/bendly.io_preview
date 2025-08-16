'use client'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Footer } from '@/components/dashboard/footer'
import { Header } from '@/components/dashboard/header'
import { NewOrderCard } from '@/components/dashboard/order/cards'
import { Button } from '@/components/uikit/buttons/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/uikit/carousel'
import { Edit } from '@/components/uikit/icons'
import { getFlashingById, initNewFlashing } from '@/lib/db/helpers/flashingHelpers'
import {
  deleteFlashingFromOrderByIds,
  deleteOrderById,
  getFlashingsByOrderId,
  getOrderById,
} from '@/lib/db/helpers/orderHelpers'
import { looksLikeGeneratedId, looksLikeGeneratedNumericId } from '@/lib/db/helpers/utils'
import { StoredOrderFlashing } from '@/types/orderTypes'
import Link from 'next/link'
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { toast } from 'sonner'
import NoFlashingSVG from '@/components/dashboard/order/noFlashingSVG'

export default function OrderReviewPage() {
  const { orderId }: { orderId: string } = useParams()

  const router = useRouter()

  if (!orderId || !looksLikeGeneratedNumericId(Number(orderId))) {
    return notFound()
  }

  const order = getOrderById(Number(orderId))

  const flashings = getFlashingsByOrderId(Number(orderId))

  const flashingsMap = useMemo(() => {
    if (!flashings || !Array.isArray(flashings)) return new Map<string, any>()
    return new Map(flashings.map((f: any) => [f?.id, f]))
  }, [flashings])

  const onDeleteFlashing = async (flashingId: string) => {
    await deleteFlashingFromOrderByIds(Number(orderId), flashingId)
    toast('Flashing removed from order')
  }

  const onSaveFlashing = (flashingId: string) => {}

  const onAddNewFlashing = () => {
    initNewFlashing(orderId).then((flashingId) => {
      router.push(`/f/${flashingId}`)
    })
  }

  const onGoHome = async () => {
    await deleteOrderById(Number(orderId))
    router.push('/dashboard')
  }

  const onProceedOrder = () => {
    router.push(`/o/${orderId}/delivery-ship`)
  }

  return (
    <>
      {(order?.flashings?.length ?? 0) > 0 ? (
        <>
          <Header title="Order Review" />
          <ContentWrapper className="pt-14 pb-24 bg-surface-page-body">
            <div className="">
              <Carousel
                opts={{
                  align: 'start',
                }}
                orientation="vertical"
                className=""
              >
                <CarouselContent className="h-[calc(100vh-130px)]">
                  {order?.flashings?.map((flash) => {
                    const found = flashingsMap.get(flash.id) ?? null
                    const augmented = found
                      ? {
                          ...found,
                          code: flash.code,
                          position: flash.position,
                          specifications: flash.specifications,
                        }
                      : null

                    if (!augmented) return

                    return (
                      <CarouselItem key={flash.id} className="last:mb-4">
                        <NewOrderCard
                          flashing={augmented}
                          onDeleteFlashing={onDeleteFlashing}
                          onSaveFlashing={onSaveFlashing}
                          orderId={orderId}
                        />
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
              </Carousel>
            </div>
          </ContentWrapper>
          <Footer>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="secondary" className="" onClick={onAddNewFlashing}>
                Add New Flashing
              </Button>
              <Button onClick={onProceedOrder}>Proceed Order</Button>
            </div>
          </Footer>
        </>
      ) : (
        <>
          {order && (
            <div className="h-full flex flex-col gap-4 items-center justify-center">
              <NoFlashingSVG />
              <p className="subtitle-large">There are no flashings for this order</p>
              <Button className="w-44" variant="default" onClick={onAddNewFlashing}>
                Add New Flashing
              </Button>
              <Button className="w-44" variant="secondary" onClick={onGoHome}>
                Go Home
              </Button>
            </div>
          )}
        </>
      )}
    </>
  )
}
