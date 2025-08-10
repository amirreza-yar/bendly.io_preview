// app/orders/[orderId]/replacement-request/layout.tsx
import { notFound } from 'next/navigation'
import { orders } from '@/utilities/demo_datas/demoOrderData'
import { Order } from '@/types/orders/orderType'
import {
  ReplacementRequestProvider,
  type ReplacementRequestData,
} from '@/providers/data_providers/order_providers/ReplacementRequestContext'

export default async function ReplacementRequestLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await paramsPromise

  const order = orders.find(
    (o: Order) => o.orderId === Number(orderId) && o.orderProgress === 'Completed',
  )
  if (!order) notFound()

  // pick only the pieces your flow needs:
  const initialData: Partial<ReplacementRequestData> = {
    order: {
      orderId: order.orderId,
      orderDateTime: order.orderDateTime,
      jobRefrence: order.jobRefrence,
      flashings: order.flashings,
    },
    // you could pre-populate other fields if needed
  }

  return (
    <ReplacementRequestProvider initialData={initialData}>{children}</ReplacementRequestProvider>
  )
}
