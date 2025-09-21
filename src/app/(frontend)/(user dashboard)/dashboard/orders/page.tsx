'use client'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Header } from '@/components/dashboard/header'
import { OrderCard, RequestCard } from '@/components/dashboard/order/cards'
import { OrderStatusBadge } from '@/components/dashboard/order/badge'
import { Box2, Building, ChevronRight, DateIcon, Delivery } from '@/components/uikit/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/uikit/tabs'
import Link from 'next/link'
import { Order } from '@/types/orders/orderType'
import { useGETAllOrders } from '@/lib/db/helpers/orderHelpers'
import { useGETAllReplacementRequests } from '@/lib/db/helpers/replacementRequestHelpers'

export default function OrdersPage() {
  const orders = useGETAllOrders()
  const replacementRequests = useGETAllReplacementRequests()

  return (
    <>
      <Header title="Orders" returnHref="/dashboard/profile" />
      <ContentWrapper className="bg-surface-page-body pb-4 pt-14 no-scrollbar">
        <Tabs defaultValue="current">
          <TabsList className="sticky top-4 bg-white z-20">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="replacement">Replacement</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <div className="grid grid-cols-1 pt-6 gap-4">
              {orders &&
                (() => {
                  const filteredOrders = orders.filter(
                    (o) =>
                      o.status === 'Pending' ||
                      o.status === 'In Production' ||
                      o.status === 'Ready for pickup' ||
                      o.status === 'On the way',
                  )

                  if (filteredOrders.length === 0)
                    return (
                      <>
                        <div className="grid items-center justify-center h-[70vh] opacity-60">
                          <h6>No orders here</h6>
                        </div>
                      </>
                    )

                  return filteredOrders.map((o, index) => <OrderCard key={index} order={o} />)
                })()}
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div className="grid grid-cols-1 pt-6 gap-4">
              {orders &&
                (() => {
                  const filteredOrders = orders.filter(
                    (o) =>
                      o.status === 'Completed' ||
                      o.status === 'Rejected' ||
                      o.status === 'Cancelled',
                  )

                  if (filteredOrders.length === 0)
                    return (
                      <>
                        <div className="grid items-center justify-center h-[70vh] opacity-60">
                          <h6>No orders here</h6>
                        </div>
                      </>
                    )

                  return filteredOrders.map((o, index) => <OrderCard key={index} order={o} />)
                })()}
            </div>
          </TabsContent>
          <TabsContent value="replacement">
            <div className="grid grid-cols-1 pt-6 gap-4">
              {replacementRequests && replacementRequests.length > 0 ? (
                replacementRequests.map((req, index) => <RequestCard key={req.requestId || index} req={req} />)
              ) : (
                <div className="grid items-center justify-center h-[70vh] opacity-60">
                  <h6>No replacement requests</h6>
                  <p className="text-sm text-gray-400 mt-1">Your replacement requests will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </ContentWrapper>
    </>
  )
}
