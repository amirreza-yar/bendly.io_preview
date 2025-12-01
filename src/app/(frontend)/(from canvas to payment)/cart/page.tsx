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
  useGETFlashingsByOrderId,
  useGETOrderById,
} from '@/lib/db/helpers/orderHelpers'
import { looksLikeGeneratedId, looksLikeGeneratedNumericId } from '@/lib/db/helpers/utils'
import { StoredOrderFlashing } from '@/types/orderTypes'
import Link from 'next/link'
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { NoFlashingSVG } from '@/components/dashboard/order/svgs'
import useSWR from 'swr'
import api, { fetcher } from '@/lib/axios'

export default function OrderReviewPage() {
  const { orderId }: { orderId: string } = useParams()

  const router = useRouter()

  const { data: cart, error, isLoading, mutate } = useSWR('/d/cart/', fetcher)

  const onDeleteFlashing = async (flashingId: string) => {
    try {
      await api.delete(`/d/flashing/${flashingId}/`)
      mutate()
      toast('Flashing removed from order')
    } catch (error: any) {
      toast('Something broke, probably not your fault.')
    }
  }

  const onSaveFlashing = (flashingId: string) => {
    // TODO Flashing PDF download function here
  }

  const onAddNewFlashing = () => {
    // TODO Here the indexedDB flashing cache should be deleted and pushed to selecting material page
  }

  const onGoHome = async () => {
    // TODO Here the cart should be deleted
    router.push('/dashboard')
  }

  const onProceedOrder = () => {
    router.push(`/cart/fulfill`)
  }

  return (
    <>
      {(cart?.flashings?.length ?? 0) > 0 ? (
        <>
          <Header title="Order Review" />
          <ContentWrapper className="pt-14 pb-24 bg-gray-100">
            <div className="">
              <Carousel
                opts={{
                  align: 'start',
                }}
                orientation="vertical"
                className=""
              >
                <CarouselContent className="h-[calc(100vh-130px)] grid md:grid-cols-2">
                  {cart?.flashings?.map((flash: any) => (
                    <CarouselItem key={flash.id} className="last:mb-4">
                      <NewOrderCard
                        flashing={flash}
                        onDeleteFlashing={onDeleteFlashing}
                        onSaveFlashing={onSaveFlashing}
                        orderId={orderId}
                      />
                    </CarouselItem>
                  ))}
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
        </>
      )}
    </>
  )
}
