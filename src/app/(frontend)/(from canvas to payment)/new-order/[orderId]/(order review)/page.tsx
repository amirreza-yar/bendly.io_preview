'use client'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Footer } from '@/components/dashboard/footer'
import { Header } from '@/components/dashboard/header'
import { NewOrderCard } from '@/components/dashboard/order/cards'
import { Button } from '@/components/uikit/buttons/button'
import { Edit } from '@/components/uikit/icons'
import { getFlashingById } from '@/lib/db/helpers/flashingHelpers'
import { getFlashingsByOrderId, getOrderById } from '@/lib/db/helpers/orderHelpers'
import { looksLikeGeneratedId, looksLikeGeneratedNumericId } from '@/lib/db/helpers/utils'
import Link from 'next/link'
import { notFound, useParams, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export default function OrderReviewPage() {
  const { orderId }: { orderId: string } = useParams()

  if (!orderId || !looksLikeGeneratedNumericId(Number(orderId))) {
    return notFound()
  }

  const order = getOrderById(Number(orderId))

  const flashings = getFlashingsByOrderId(Number(orderId))

  // create a map for O(1) lookups; memoize to avoid rebuilding each render
  const flashingsMap = useMemo(() => {
    if (!flashings || !Array.isArray(flashings)) return new Map<string, any>()
    return new Map(flashings.map((f: any) => [f?.id, f]))
  }, [flashings])

  const onDeleteFlashing = (flashingId: string) => {}

  const onSaveFlashing = (flashingId: string) => {}

  const onAddNewFlashing = () => {}

  const onProceedOrder = () => {}

  return (
    <>
      <Header
        title="Order Review"
        returnHref={`/f/${order?.flashings?.[order.flashings.length - 1]?.id ?? ''}/details?orderId=${orderId}`}
      />
      <ContentWrapper className="pt-18 bg-surface-page-body">
        <div className="grid gap-4">
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
              <NewOrderCard
                key={flash.id} // stable key
                flashing={augmented}
                onDeleteFlashing={onDeleteFlashing}
                onSaveFlashing={onSaveFlashing}
                orderId={orderId}
              />
            )
          })}
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
  )
}
