import RevenueChartCard from '@/components/admin/charts/revenue'
import OrdersChartCard from '@/components/admin/charts/bar'
import CompletedWidget from '@/components/admin/widgets/completed'
import PendingWidget from '@/components/admin/widgets/pending'
import ReadyWidget from '@/components/admin/widgets/ready'
import ProductionWidget from '@/components/admin/widgets/production'

export default function AdminDashboardOverview() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-8 p-8 bg-[#F1F5F9]">
        <div className="grid auto-rows-min gap-8 md:grid-cols-4">
          <PendingWidget number={5} />
          <PendingWidget number={5} />
          <PendingWidget number={5} />
          <PendingWidget number={5} />
        </div>
        <div className="grid auto-rows-min gap-8 md:grid-cols-2">
          <RevenueChartCard />
          <OrdersChartCard />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    </>
  )
}
