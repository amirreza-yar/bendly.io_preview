'use client'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Header } from '@/components/dashboard/header'
import { NewOrderSummaryAccordion } from '@/components/dashboard/order/accordion'
import DividerWithText from '@/components/uikit/dividerWithText'
import { Magnifier, Plus } from '@/components/uikit/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/uikit/tabs'
import { Textarea } from '@/components/uikit/textarea'
import { getFlashingsByOrderId, getOrderById } from '@/lib/db/helpers/orderHelpers'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

export default function DeliveryAndShipping() {
  const { orderId } = useParams<{ orderId: string }>()

  const order = getOrderById(Number(orderId))

  const flashings = getFlashingsByOrderId(Number(orderId))

  const flashingsMap = useMemo(() => {
    if (!flashings || !Array.isArray(flashings)) return new Map<string, any>()
    return new Map(flashings.map((f: any) => [f?.id, f]))
  }, [flashings])

  const augmentedFlashings = useMemo(() => {
    if (!order?.flashings) return []

    return order.flashings
      .map((flash) => {
        const found = flashingsMap.get(flash.id) ?? null
        if (!found) return null

        return {
          ...found,
          code: flash.code,
          position: flash.position,
          specifications: flash.specifications?.map((spec) => ({
            ...spec,
            cost: (spec.quantity * spec.length * (found.totalGirth ?? 0)) / 10000,
          })),
        }
      })
      .filter(Boolean)
  }, [order?.flashings, flashingsMap])

  console.log(augmentedFlashings)

  return (
    <>
      <Header title="Shipping & Delivery" returnHref={`/o/${orderId}/review`} />
      <ContentWrapper className="pt-14 pb-4 px-0 bg-surface-page-body">
        <div className="bg-white raltive">
          <Tabs defaultValue={order?.deliveryType ?? 'delivery'}>
            <TabsList className="my-4 sticky top-40 bg-white z-1 mx-4">
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="pickup">Pickup</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid gap-2">
          <div className="grid pt-2 pb-4 px-4 bg-white">
            <div className="grid gap-3 bg-white">
              <div className="grid pb-2">
                <h6>Job Reference</h6>
                <p className="subtitle-regular">
                  Choose an existing job reference or create a new one to organize this order
                </p>
              </div>
              <Link
                href={`/o/${orderId}/delivery-ship/j`}
                className=" flex gap-2 item-center justify-center py-2.5 rounded-md border border-border-default font-semibold text-sm-m"
              >
                <Magnifier className="size-5" />
                View And Search Job Reference
              </Link>
              <DividerWithText text="OR" />
              <Link
                href=""
                className=" flex gap-2 item-start justify-center py-2.5 rounded-md border border-border-default font-semibold text-sm-m"
              >
                <Plus className="size-5" />
                Create New Job Reference
              </Link>
            </div>
          </div>
          <div className="grid gap-3 py-4 px-4 bg-white">
            <h6>Order Notes</h6>
            <Textarea
              placeholder="Add an optional note (if needed)"
              className="px-4 py-3 resize-none min-h-21"
              maxLength={300}
            />
          </div>
          <div className="grid gap-3 py-4 px-4 bg-white">
            <h6>Order Summary</h6>

            {order?.flashings && <NewOrderSummaryAccordion flashings={augmentedFlashings} />}
          </div>
        </div>
      </ContentWrapper>
    </>
  )
}
