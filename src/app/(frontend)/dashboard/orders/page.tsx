import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Header } from '@/components/dashboard/header'
import { OrderCard, RequestCard } from '@/components/dashboard/order/cards'
import { OrderStatusBadge } from '@/components/dashboard/order/badge'
import { Box2, Building, ChevronRight, DateIcon, Delivery } from '@/components/uikit/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/uikit/tabs'
import Link from 'next/link'
import { Order } from '@/types/orders/orderType'
import { orders, replacementRequests } from '@/utilities/demoOrderData'

export default function OrdersPage() {
  return (
    <>
      <Header title="Orders" returnHref="/dashboard/profile" />
      <ContentWrapper className="bg-surface-page-body pb-4 no-scrollbar">
        <Tabs defaultValue="current">
          <TabsList className="sticky top-4 bg-white z-20">
            <TabsTrigger className value="current">
              Current
            </TabsTrigger>
            <TabsTrigger className value="past">
              Past
            </TabsTrigger>
            <TabsTrigger className value="replacement">
              Replacement
            </TabsTrigger>
          </TabsList>
          <TabsContent className value="current">
            <div className="grid grid-cols-1 pt-6 gap-4">
              {orders
                .filter(
                  (o) =>
                    o.orderStatus === 'Pending' ||
                    o.orderStatus === 'In Production' ||
                    o.orderStatus === 'Ready for pickup' ||
                    o.orderStatus === 'On the way',
                )
                .map((order, index) => (
                  <OrderCard key={index} order={order} />
                ))}
            </div>
          </TabsContent>
          <TabsContent className value="past">
            <div className="grid grid-cols-1 pt-6 gap-4">
              {orders
                .filter(
                  (o) =>
                    o.orderStatus === 'Completed' ||
                    o.orderStatus === 'Rejected' ||
                    o.orderStatus === 'Cancelled',
                )
                .map((order: Order, index) => (
                  <OrderCard key={index} order={order} />
                ))}
            </div>
          </TabsContent>
          <TabsContent className value="replacement">
            <div className="grid grid-cols-1 pt-6 gap-4">
              {replacementRequests.map((req, index) => (
                <RequestCard key={index} req={req} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </ContentWrapper>
    </>
  )
}
